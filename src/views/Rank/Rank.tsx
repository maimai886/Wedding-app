import style from "./rank.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximizeMark.svg";
import Pagination from "react-bootstrap/Pagination";
import { useEffect, useState } from "react";
import { belikeApi, dislikeApi, getAllFileListApi } from "../../request";
import useLoading from "../../hook/useLoading";
import { FileListData } from "../Information/information.interface";
import { ReactComponent as Heart } from "../../assets/svgs/heartMark.svg";

const Rank = () => {
  /**
   * 状態定義
   */
  //ユーザーinfo
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };

  //loadingModel
  const loading = useLoading();

  const [currentPage, setCurrentPage] = useState(1);

  const [img, setImg] = useState<FileListData[]>([]);

  const [max, setMax] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);

  // 計算總頁數
  const totalPages = Math.ceil(count / 10);

  // 處理分頁
  const renderPagination = () => {
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => pageClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  async function getAllImg(page?: number): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }

    loading.open();
    const result = await getAllFileListApi({
      page: page,
      sqlNo: userInfo.sqlNo,
    });
    console.log("test", result);
    if (result.code == 0) {
      setImg(result.fileList);
      setCount(() => result.count);
    }
    loading.close();
  }

  function pageClick(page: number): void {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  function handleClick(item: FileListData, index: number): void {
    setImg((prevItems) => {
      const newItems = [...prevItems];
      const newItem = { ...newItems[index] };
      newItem.isLike = newItem.isLike === "true" ? "false" : "true";
      newItem.beLike =
        newItem.isLike === "true" ? newItem.beLike + 1 : newItem.beLike - 1;

      newItem.isLike === "true" ? belikeClick(item) : dislikeClick(item);
      newItems[index] = newItem;
      return newItems;
    });
    //belikeClick(item);
  }

  async function belikeClick(item: FileListData): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { pictureSqlNo: item.sqlNo, sqlNo: item.userSqlNo };
    const result = await belikeApi(param);
    if (result.code == 0) {
    }
  }

  async function dislikeClick(item: FileListData): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { pictureSqlNo: item.sqlNo, sqlNo: item.userSqlNo };
    const result = await dislikeApi(param);
    if (result.code == 0) {
    }
  }
  /**
   * 監視定義
   */
  useEffect(() => {
    getAllImg(currentPage);
  }, [currentPage]);

  return (
    <div className={`${style.main}`}>
      {
        //頭部
        <div className={style.mainAreaHeader}>
          <div className={style.searchWrapper} id="searchLine">
            <input
              className={style.searchInput}
              type="text"
              placeholder="查詢已上傳圖片"
            />
            <SearchButton />
          </div>
        </div>
      }

      {
        //圖片區

        <section className={style.contentSection}>
          {img &&
            img.map((item, index) => (
              <div
                className={style.contentSectionLine}
                key={item.sqlNo}
                onDoubleClick={() => handleClick(item, index)}
              >
                <div className={`${style.sectionPart}  ${style.left}`}>
                  <a className={style.imageWrapper}>
                    <div className={style.imageOverlay}>
                      <div className={style.videoInfo}>
                        <div className={style.videoInfoText}>
                          <p className={`${style.videoName} ${style.medium}`}>
                            {item.originalName}
                            <br />
                            {item.userName}
                          </p>
                        </div>
                        <div className={style.heartBox}>
                          {item.beLike}
                          <Heart
                            className={`${
                              item.isLike == "true" && style.isLike
                            }`}
                            onClick={() => handleClick(item, index)}
                          />
                        </div>
                        <Maximize
                          className={style.maximize}
                          onClick={() => {
                            const newImg = img.map((imgItem) =>
                              imgItem.sqlNo === item.sqlNo
                                ? {
                                    ...imgItem,
                                    isMaximized: !imgItem.isMaximized,
                                  }
                                : imgItem
                            );
                            setImg(newImg);
                          }}
                        />
                      </div>
                    </div>
                    <img
                      src={`data:image/png;base64,${item.imgData}`}
                      alt="無法顯示"
                      className={`${item.isMaximized && style.max}`}
                    />
                  </a>
                </div>
              </div>
            ))}
          <footer className={style.footer}>
            <div className={style.page}>
              <Pagination>{renderPagination()}</Pagination>
            </div>
          </footer>
        </section>
      }
    </div>
  );
};

export default Rank;
