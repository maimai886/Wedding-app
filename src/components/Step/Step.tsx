import style from "./step.module.scss";
import { ReactComponent as Check } from "../../assets/svgs/checkMark.svg";
import { StepModel } from "./step.interface";
import moment from "moment";
import { useEffect, useState } from "react";

/**
 * ステップコンポーネントのプロパティインターフェース
 */
interface StepProps {
  StepData: StepModel; // ステップデータ
}

/**
 * ステップコンポーネント
 * スケジュールの各ステップを表示
 */
const Step = (props: StepProps) => {
  /**
   * 状態定義
   */
  // 現在のステップ状態
  const [isTime, setIsTime] = useState<boolean>(false);

  // 現在時刻の状態
  const [isTimeNow, setIsTimeNow] = useState<boolean>(false);

  /**
   * 副作用定義
   */
  // 時間判定処理
  useEffect(() => {
    const now = parseInt(moment().format("HHmm"));
    const startTime = parseInt(props.StepData?.startTime.replace(":", ""));
    const endtTime = parseInt(props.StepData?.endTime.replace(":", ""));
    let result = false;
    if (now > startTime) {
      result = true;
      setIsTime(result);
    }

    result = false;
    if (now >= startTime && now <= endtTime) {
      result = true;
      setIsTimeNow(result);
    }
  }, []);

  return (
    <div className={style.main}>
      {/* 機能エリア */}
      <section className={style.contentSection}>
        <div className={style.receivedItemLine}>
          {/* 時間表示 */}
          <div className={style.progressLine}>
            <span className={`${style.time} ${style.start}`}>
              {props.StepData.startTime}
            </span>
            <span className={`${style.time} ${style.end}`}>
              {props.StepData.endTime}
            </span>
          </div>
          {/* ステップ内容 */}
          <div className={style.stepsContent}>
            <div className={style.stepInfo}>
              {props.StepData.eventName}{" "}
              <span className={style.infoPurple}>
                {props.StepData.eventDetail}
              </span>
            </div>
            {/* 画像表示 */}
            <div className={style.stepImg}>
              {props.StepData?.img &&
                props.StepData.img.map((item, index) => {
                  return (
                    <div key={index} className={style.imageWrapper}>
                      <img src={item} />
                    </div>
                  );
                })}
            </div>
          </div>
          {/* 完了マーク */}
          {isTime && (
            <div className={style.svgContent}>
              <Check
                className={`${style.svgStyle} ${
                  isTimeNow ? style.isTimeNow : null
                }`}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Step;
