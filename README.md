# ChronoLedger

中文二手機械錶市場價格查詢網頁。介面以繁體中文為主，採黑金精品風格，支援市場、品牌與產品類別篩選，並提供錶商網站連結與詢價流程。

## 功能

- 搜尋品牌、型號或編號
- 依中國、日本、香港、歐洲、美國市場篩選
- 依品牌與產品類別篩選
- 顯示今日均價、近 30 日走勢與漲跌幅
- 顯示錶款結果、錶況、年份與地區
- 提供錶商網站連結與詢價按鈕
- API key 未設定時使用 demo provider

## API

- `GET /api/search?q=&market=&brand=&category=`
- `GET /api/watches/[id]`
- `GET /api/filters`
- `GET /api/dealers?market=&watchId=`
- `POST /api/inquiries`
- `POST /api/jobs/update-prices`

## 開發

```bash
npm install
npm run dev
```

打開 `http://localhost:3000`。

## 外部資料

目前已保留 provider adapter 介面。正式接資料時，優先使用合法 API、授權資料或合作錶商來源，例如 WatchCharts API 與 eBay Browse API。中國市場來源需接入可授權 API 或合作錶商資料。
