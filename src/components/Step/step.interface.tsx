/**
 * ステップモデルインターフェース
 * スケジュールの各ステップのデータ構造を定義
 */
export interface StepModel {
  id: number; // ステップの一意の識別子
  startTime: string; // 開始時刻
  endTime: string; // 終了時刻
  eventName?: string; // イベント名（オプション）
  eventDetail?: string; // イベント詳細（オプション）
  img?: string[]; // 関連画像のURL配列（オプション）
}
