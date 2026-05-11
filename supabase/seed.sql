-- Seed: 12 notes across 5 categories
insert into notes (title, composer, description, category, instrument, difficulty, price_uzs, cover_url, pdf_path)
values
  ('Munojot — O''zbek xalq kuyi', 'O''zbek xalq kuyi', 'O''zbekning eng mashhur mumtoz kuylaridan biri. Chuqur va dilrabo ohanglarga ega.', 'O''zbek', 'Pianino', 'O''rta', 45000, 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=800&q=80', 'samples/munojot.pdf'),

  ('Chopin Nocturne Op.9 No.2', 'Fryderyk Chopin', 'Romantizm davrining nafis fortepiano asari. Yumshoq melodiya va boy garmoniya.', 'Klassik', 'Pianino', 'Yuqori', 65000, 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80', 'samples/chopin-op9-2.pdf'),

  ('Yor-yor', 'O''zbek xalq qo''shig''i', 'An''anaviy to''y qo''shig''i, vokal va dutor uchun moslashtirilgan.', 'O''zbek', 'Dutor', 'Boshlang''ich', 30000, 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=800&q=80', 'samples/yor-yor.pdf'),

  ('Autumn Leaves', 'Joseph Kosma', 'Jazz standartlarining sevimlisi. Improvizatsiya uchun ajoyib asos.', 'Jazz', 'Pianino', 'O''rta', 55000, 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80', 'samples/autumn-leaves.pdf'),

  ('Tashkent Vals', 'Manas Leviev', 'Toshkentga bag''ishlangan zamonaviy vals. Sokin va shu bilan birga ko''tarinki ohang.', 'Zamonaviy', 'Pianino', 'O''rta', 50000, 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80', 'samples/tashkent-vals.pdf'),

  ('Beethoven — Für Elise', 'Ludwig van Beethoven', 'Klassik fortepiano dasturlarining mumtoz asari. Boshlang''ichlar uchun ham mos.', 'Klassik', 'Pianino', 'Boshlang''ich', 35000, 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800&q=80', 'samples/fur-elise.pdf'),

  ('Take Five', 'Paul Desmond', 'Jazz tarixidagi eng mashhur 5/4 ritmidagi asar.', 'Jazz', 'Pianino', 'Yuqori', 75000, 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=800&q=80', 'samples/take-five.pdf'),

  ('Imagine', 'John Lennon', 'XX asrning eng mashhur pop balladalaridan. Sodda va ta''sirchan.', 'Pop', 'Pianino', 'Boshlang''ich', 40000, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80', 'samples/imagine.pdf'),

  ('Bach — Prelude in C', 'Johann Sebastian Bach', 'Yaxshi notalashtirilgan klavir to''plamidan mumtoz prelyud.', 'Klassik', 'Pianino', 'O''rta', 60000, 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80', 'samples/bach-prelude-c.pdf'),

  ('Andijon polkasi', 'O''zbek xalq kuyi', 'Quvnoq va energiyaga to''la xalq raqs kuyi.', 'O''zbek', 'Skripka', 'O''rta', 38000, 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80', 'samples/andijon-polkasi.pdf'),

  ('Hallelujah', 'Leonard Cohen', 'Doimiy mashhur ballada. Vokal va gitara uchun aranjirovka.', 'Pop', 'Gitara', 'Boshlang''ich', 42000, 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80', 'samples/hallelujah.pdf'),

  ('Samarqand sham''i', 'Maqsud Sherali', 'Zamonaviy o''zbek bastakorining mashhur asari.', 'Zamonaviy', 'Vokal', 'Yuqori', 150000, 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80', 'samples/samarqand-shami.pdf')

on conflict do nothing;
