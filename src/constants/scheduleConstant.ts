import { ScheduleDefaultData } from "../views/Schedule/schedule.interface";

const scheduleOne = {
  ...ScheduleDefaultData,
  id:1,
  startTime: "12:00",
  endTime: "12:20",
  eventName: "開場",
  eventDetail: "新娘新郎入場",
  img: [
    "https://images.pexels.com/photos/371285/pexels-photo-371285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
};

const scheduleTwo = {
  ...ScheduleDefaultData,
  id:2,
  startTime: "12:20",
  endTime: "13:00",
  eventName: "開席",
  eventDetail: "吃吃喝喝看表演!",
  img: [
    "https://images.pexels.com/photos/114974/pexels-photo-114974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
};

const scheduleThree = {
  ...ScheduleDefaultData,
  id:3,
  startTime: "13:00",
  endTime: "14:00",
  eventName: "活動",
  eventDetail: "抽獎幸運兒是誰~",
  img: [
    "https://images.pexels.com/photos/17796/christmas-xmas-gifts-presents.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
};

const scheduleFour = {
  ...ScheduleDefaultData,
  id:4,
  startTime: "14:00",
  endTime: "14:30",
  eventName: "回家",
  eventDetail: "拍拍照，開心回家",
  img: [
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
    "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
  ],
};

export function getScheduleConstant() {
  const schedules = [scheduleOne, scheduleTwo, scheduleThree, scheduleFour];
  const result = [];

  for (let i = 0; i < schedules.length; i++) {
    const schedule = schedules[i];

    result.push({
      id:schedule.id,
      eventName: schedule.eventName,
      eventDetail: schedule.eventDetail,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      img: schedule.img,
    });
  }

  return result;
}
