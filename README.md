# Snake Game | React

## 專案簡介

一個可以在瀏覽器上直接進行的貪食蛇遊戲。

## Live Demo
https://rubylo718.github.io/snake-game/

## 功能

- 綠色格子代表蛇。紅色格子代表食物。遊戲開始時，預設蛇從座標 (4, 4) 開始向右移動，第一個食物在蛇的右方 5 格處。
- 當蛇移動到食物格子，表示將食物吃掉。此時遊戲玩家會得到 1 分，蛇的長度會往後延長 1 格。
- 食物被吃掉之後，會在版面上再產生一個新的食物，位置隨機，但不會與蛇的位置重疊。
- 若蛇前進的方向撞到版面邊界，或是撞到自己，則遊戲結束。此時視窗會跳出訊息顯示遊戲結束、玩家分數等，按確定後可以重新開始遊戲。

## 技術說明

- 使用雙層迴圈產出遊戲版面，每個格子皆包含一個不重複的正整數值。例如 10 x 10 的版面，每個格子內的數值由左到右為 1, 2, ... 10，由上往下為 1, 11, 21... 91。
- 使用單向 LinkedList 代表蛇身。蛇身每個格子代表一個節點，值為包含座標位置（行、列）與上述不重複的正整數值，節點 next 指向下一個節點。依照蛇目前前進方向，將 LinkedList 接上新的 head 並刪除舊的 tail 節點，達到蛇身前進的效果。
- 使用 Set 紀錄目前所有蛇身所佔的格子的數值。利用 `set.add()`, `set.delete()` 處理蛇身移動與變長，`set.has()` 得知是不是與自己相撞。
- 使用 browser API `document.addEventListener()` 監聽使用者的方向鍵輸入，並將此監聽函式放在 `useEffect` hook 中，以方向作為 effect dependency，使 component 能同步更新狀態，並 return cleanup function `document.removeEventListener()`，避免監聽事件累積。
- 依照先前遊玩經驗，加入檢查下一步的方向不與現在前進方向相反（例如目前向右前進，按左鍵不會造成蛇身回頭而自撞結束遊戲）。
- 使用 `Math.random()` 隨機產生遊戲版面範圍內的正整數，代表食物產生。使用 `set.has()`檢查隨機產生的食物位置是否為蛇身所在，若是的話，則函式會繼續呼叫自身函示（遞迴），直到找到不在蛇身 set 中的位置。
- 建立 custom hook `useInterval`，處理 `setInterval()` delay 時間與方向變化時 `useEffect` 重新渲染的衝突，實現蛇身在每隔固定時間移動，並在使用者按下方向鍵後，轉換移動方向。

## 專案套件

- Runtime Environment: Node.js @18.17.1
- Front-end Library: React @18.3.1

## 參考資料

- `useEffect` and event - [React.dev - Subscribing to events](https://react.dev/learn/synchronizing-with-effects#subscribing-to-events)
- Custom hook `useInterval` - [Making setInterval Declarative with React Hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
- Project planning - [Clément Mihailescu](https://github.com/clementmihailescu/Snake-Game-Reverse-LL-Tutorial)
- Cooperated with Github Copilot

## 作者
Ruby Lo 