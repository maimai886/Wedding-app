// The wedding this demo is set up for. Everyone here is made up; all pictures are AI-generated.
const demo = (f: string) => `${import.meta.env.BASE_URL}demo/${f}`;

export const wedding = {
  couple: { groom: "Ren", bride: "Hana" },
  date: "2026 · 11 · 21",
  venue: "楓之庭 Maple Garden",
  hero: demo("hero.jpg"),
  frameTable: demo("frame-table.jpg"),
  story: [
    { img: demo("hero.jpg"), title: "今天", text: "在楓葉最紅的季節，我們決定牽手走下去。" },
    { img: demo("bride-child.jpg"), title: "Hana 小時候", text: "抱著小象玩偶到處跑，笑聲比誰都大。" },
    { img: demo("groom-child.jpg"), title: "Ren 小時候", text: "最寶貝的是那顆黃色海灘球，誰都不准碰。" },
  ],
};

export interface ScheduleItem { id: string; start: string; end: string; title: string; detail: string; img: string; icon: IconName }
export type IconName = "home" | "camera" | "image" | "heart" | "trophy" | "calendar" | "gift" | "pen" | "upload" | "x"
  | "chevron-left" | "chevron-right" | "trash" | "search" | "user" | "settings" | "clock" | "sparkle" | "frame" | "eye" | "eye-off" | "star";

export const schedule: ScheduleItem[] = [
  { id: "s1", start: "11:30", end: "12:00", title: "迎賓", detail: "簽到、拍照區開放，先找到自己的座位", img: demo("garden.jpg"), icon: "user" },
  { id: "s2", start: "12:00", end: "12:20", title: "新人進場", detail: "請大家準備好手機，進場時最好拍", img: demo("bouquet.jpg"), icon: "heart" },
  { id: "s3", start: "12:20", end: "13:10", title: "開席", detail: "吃吃喝喝，記得上傳你這桌的照片", img: demo("table.jpg"), icon: "gift" },
  { id: "s4", start: "13:10", end: "13:30", title: "切蛋糕・敬酒", detail: "新人到各桌敬酒，舉杯的瞬間別錯過", img: demo("cake.jpg"), icon: "sparkle" },
  { id: "s5", start: "13:30", end: "14:00", title: "抽獎", detail: "上傳過照片的人都有一次抽獎機會", img: demo("raffle.jpg"), icon: "trophy" },
  { id: "s6", start: "14:00", end: "14:30", title: "送客", detail: "仙女棒送客，最後一張大合照", img: demo("sparklers.jpg"), icon: "camera" },
];
