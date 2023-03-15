import style from "./step.module.scss";
import { StepModel } from "./step.interface";

interface StepProps {
  StepData: StepModel;
}

const Step = (props: StepProps) => {
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
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  );
};

export default Step;
