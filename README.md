# IshTop — Telegram Mini App

## Loyiha tarkibi
- `public/index.html` — siz yuborgan IshTop sayti.
- `server.js` — API va e'lonlarni JSON faylga saqlash.
- `data/posts.json` — e'lonlar saqlanadigan fayl (birinchi ishga tushganda yaratiladi).

## Ishga tushirish
1. Node.js 18 yoki undan yangisini o'rnating.
2. Terminalda loyiha papkasiga kiring.
3. `npm install` buyrug'ini bajaring.
4. BotFather bergan bot tokenini `BOT_TOKEN` muhit o'zgaruvchisiga maxfiy tarzda kiriting.
5. `npm start` buyrug'ini bajaring.
6. Brauzerda `http://localhost:3000` manzilini oching.

Windows PowerShell uchun:
```powershell
$env:BOT_TOKEN="BOTFATHER_TOKENINGIZ"
npm start
```

Linux/macOS uchun:
```bash
BOT_TOKEN="BOTFATHER_TOKENINGIZ" npm start
```

## Telegramga ulash
1. Hostingga loyihani joylang va HTTPS manzil oling.
2. BotFather'da `/mybots` → botingiz → `Bot Settings` → `Menu Button` → `Configure menu button`.
3. Tugma nomini `IshTop` qilib, hostingdagi HTTPS manzilni kiriting.
4. Hosting sozlamalarida `BOT_TOKEN` nomli secret/environment variable yarating va BotFather tokenini shu yerga kiriting.
5. Deploy/restart qiling.

## Muhim
- Bot tokenini HTML ichiga yozmang va hech kimga yubormang.
- E'lon joylash faqat Telegram ichida ochilgan va server tomonidan tekshirilgan Mini App sessiyasida ishlaydi.
- Hosting qayta ishga tushganda `data/posts.json` saqlanib qolishi uchun persistent disk/volume yoqilishi kerak. Aks holda e'lonlar yo'qolishi mumkin.
- Hozircha bu loyiha oddiy JSON saqlashdan foydalanadi; katta trafik uchun ma'lumotlar bazasiga o'tkazish tavsiya etiladi.
