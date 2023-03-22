import style from "./schedule.module.scss";
import Step from "../../components/Step/Step";
import { useEffect, useState } from "react";
import { getScheduleConstant } from "../../constants/scheduleConstant";
import { StepModel } from "../../components/Step/step.interface";

const Schedule = () => {
  /**
   * 状態定義
   */
  //スケジュールデータ
  const [scheduleData, setScheduleData] = useState<StepModel[]>([]);

  /**
   * 監視定義
   */
  useEffect(() => {
    const result = getScheduleConstant();
    setScheduleData(result);
  }, []);
  return (
    <div className={style.main}>
      {
        //功能區
        <section className={style.contentSection}>
          <div>今日行程　Schedule</div>
          {scheduleData?.map((item) => (
            <Step key={item.id} StepData={item} />
          ))}
        </section>
      }
    </div>
  );
};

export default Schedule;
