import style from "./rank.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximizeMark.svg";
import Pagination from "react-bootstrap/Pagination";
import { useEffect, useState } from "react";
import { getAllFileListApi } from "../../request";
import useLoading from "../../hook/useLoading";
import { FileListData } from "../Information/information.interface";

const Rank = () => {
  //loadingModel
  const loading = useLoading();

  const [currentPage, setCurrentPage] = useState(1);

  const [img, setImg] = useState<FileListData[]>([]);

  const [max, setMax] = useState<boolean>(false);

  // 計算總頁數
  const totalPages = Math.ceil(img?.length / 10);

  // 處理分頁
  const renderPagination = () => {
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  // 顯示當前頁的圖片
  const renderImages = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return img?.slice(startIndex, endIndex).map((item) => (
      <div className={style.contentSectionLine} key={item.sqlNo}>
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
                <Maximize
                  className={style.maximize}
                  onClick={() => setMax(!max)}
                />
              </div>
            </div>
            <img
              src={`data:image/png;base64,${item.imgData}`}
              alt="無法顯示"
              className={`${max && style.max}`}
            />
          </a>
        </div>
      </div>
    ));
  };

  async function getAllImg(): Promise<void> {
    const result = await getAllFileListApi(null);
    console.log("test", result);
    if (result.code == 0) {
      setImg(result.fileList);
    }
  }

  /**
   * 監視定義
   */
  useEffect(() => {
    getAllImg();
  }, []);
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
          {renderImages()}
          <div className={style.page}>
            <Pagination>{renderPagination()}</Pagination>
          </div>
        </section>
      }
    </div>
  );
};

export default Rank;
