import style from "./schedule.module.scss";
import Step from "../../components/Step/Step";
import { ScheduleDefaultData } from "./schedule.interface";
import { useState } from "react";

const Schedule = () => {
  /**
   * 状態定義
   */
  //スケジュールデータ
  const scheduleOne = {
    ...ScheduleDefaultData,
    startTime: "12:00",
    endTime: "12:20",
    eventName: "開場",
    eventDetail: "新娘新郎入場",
  };

  return (
    <div className={style.main}>
      {
        //功能區
        <section className={style.contentSection}>
          <Step StepData={scheduleOne} />
        </section>
      }
    </div>
  );
};

export default Schedule;
