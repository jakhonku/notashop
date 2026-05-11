-- Kutilayotgan buyurtmalar — Click P2P qo'lda tasdiqlash uchun
create table if not exists pending_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  user_email text,
  user_name text,
  customer_phone text not null,
  note_ids uuid[] not null,
  total_uzs integer not null,
  status text default 'pending' check (status in ('pending','paid','cancelled')),
  admin_note text,
  created_at timestamptz default now(),
  confirmed_at timestamptz
);

create index if not exists pending_orders_status_idx on pending_orders(status, created_at desc);

alter table pending_orders enable row level security;

-- Foydalanuvchi o'z buyurtmalarini ko'ra oladi
drop policy if exists "pending_orders_owner_read" on pending_orders;
create policy "pending_orders_owner_read" on pending_orders for select
  using (auth.uid() = user_id);

-- Autentifikatsiyalashgan foydalanuvchi o'z nomidan yangi buyurtma yaratadi
drop policy if exists "pending_orders_self_insert" on pending_orders;
create policy "pending_orders_self_insert" on pending_orders for insert
  with check (auth.uid() = user_id);

-- Admin barchasini ko'rishi va yangilashi mumkin
drop policy if exists "pending_orders_admin_all" on pending_orders;
create policy "pending_orders_admin_all" on pending_orders for all
  using (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Buyurtmani tasdiqlash funksiyasi — admin chaqiradi, ichidagi notalarni purchases ga ko'chiradi
create or replace function confirm_pending_order(order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  note_id uuid;
begin
  -- Admin tekshiruvi
  if not exists(select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Faqat administrator tasdiqlashi mumkin';
  end if;

  select * into rec from pending_orders where id = order_id and status = 'pending';
  if not found then
    raise exception 'Buyurtma topilmadi yoki allaqachon tasdiqlangan';
  end if;

  -- Har bir nota uchun purchase yaratish (takrorlar e'tiborga olinmaydi)
  foreach note_id in array rec.note_ids loop
    insert into purchases (user_id, note_id, amount_uzs, stripe_session_id)
    values (
      rec.user_id,
      note_id,
      (select price_uzs from notes where id = note_id),
      'click-p2p-' || order_id::text
    )
    on conflict (user_id, note_id) do nothing;
  end loop;

  -- Status'ni paid ga o'tkazish
  update pending_orders
  set status = 'paid', confirmed_at = now()
  where id = order_id;
end;
$$;

grant execute on function confirm_pending_order(uuid) to authenticated;
