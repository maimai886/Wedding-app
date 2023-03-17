import style from "./step.module.scss";
import { ReactComponent as Check } from "../../assets/svgs/checkMark.svg";
import { StepModel } from "./step.interface";
import moment from "moment";
import { useEffect, useState } from "react";

interface StepProps {
  StepData: StepModel;
}

const Step = (props: StepProps) => {
  /**
   * 状況定義
   */
  //現在Step
  const [isTime, setIsTime] = useState<boolean>(false);

  //現在時間
  const [isTimeNow, setIsTimeNow] = useState<boolean>(false);

  /**
   * 監視
   */
  //時間判断処理
  useEffect(() => {
    const now = parseInt(moment().format("HHmm"));
    const startTime = parseInt(props.StepData.startTime.replace(":", ""));
    const endtTime = parseInt(props.StepData.endTime.replace(":", ""));
    let result = false;
    if (now > startTime) {
      result = true;
    }
    setIsTime(result);

    result = false;
    if (now >= startTime && now <= endtTime) {
      result = true;
    }
    setIsTimeNow(result);
  }, []);
  return (
    <div className={style.main}>
      {
        //功能區
        <section className={style.contentSection}>
          <div className={style.receivedItemLine}>
            <div className={style.progressLine}>
              <span className={`${style.time} ${style.start}`}>
                {props.StepData.startTime}
              </span>
              <span className={`${style.time} ${style.end}`}>
                {props.StepData.endTime}
              </span>
            </div>
            <div className={style.stepsContent}>
              <div className={style.stepInfo}>
                {props.StepData.eventName}{" "}
                <span className={style.infoPurple}>
                  {props.StepData.eventDetail}
                </span>
              </div>
              <div className={style.stepImg}>
                {props.StepData?.img &&
                  props.StepData.img.map((item) => {
                    return (
                      <div className={style.imageWrapper}>
                        <img src={item} />
                      </div>
                    );
                  })}
              </div>
            </div>
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
      }
    </div>
  );
};

export default Step;
