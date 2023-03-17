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
    img: [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
      "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
    ],
  };

  const scheduleTwo = {
    ...ScheduleDefaultData,
    startTime: "12:20",
    endTime: "13:00",
    eventName: "開席",
    eventDetail: "吃吃喝喝看表演!",
    img: [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
      "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
    ],
  };

  const scheduleThree = {
    ...ScheduleDefaultData,
    startTime: "13:00",
    endTime: "14:00",
    eventName: "活動",
    eventDetail: "抽獎幸運兒是誰~",
    img: [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
      "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
    ],
  };

  const scheduleFour = {
    ...ScheduleDefaultData,
    startTime: "14:00",
    endTime: "14:30",
    eventName: "回家",
    eventDetail: "拍拍照，開心回家",
    img: [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
      "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
    ],
  };
  return (
    <div className={style.main}>
      {
        //功能區
        <section className={style.contentSection}>
          <div>今日行程　Schedule</div>
          <Step StepData={scheduleOne} />
          <Step StepData={scheduleTwo} />
          <Step StepData={scheduleThree} />
          <Step StepData={scheduleFour} />
        </section>
      }
    </div>
  );
};

export default Schedule;
