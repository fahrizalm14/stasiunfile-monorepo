import "css.gg/icons/css/check.css";
import "css.gg/icons/css/close.css";

import clsx from "clsx";
import React from "react";

import styles from "./index.module.css";

export default function PriceFeatures(): JSX.Element {
  return (
    <section className={clsx("pt-2", styles.features)}>
      <div className="container">
        <h2 className="hero__title text--center">Harga Layanan</h2>
        <p className="hero__subtitle text--center mb-3">
          Berikut rincian harga layanan StasiunFile per bulan:
        </p>
          <div className={styles.wrapper}>
            <div className={clsx(styles.table, styles.basic)}>
              <div className={clsx(styles.priceSection, "mb-3")}>
                <div className={styles.priceArea}>
                  <div className={styles.innerArea}>
                    <span className={styles.priceFree}>Free</span>
                  </div>
                </div>
              </div>
              <div className={clsx(styles.packageName)}></div>
              <ul className={styles.features}>
                <li>
                  <span className={styles.listName}>Penyimpanan online <b className="purple-text">17GB</b></span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>File manager</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>One time file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Kustom kode file (5 file saja)</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur limit downloadan (5 file saja)</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur kedaluwarsa (5 file saja)</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Amankan file dengan password</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Batas upload file 150MB/hari</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Maksimal ukuran upload 120MB/file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tidak ada batasan membagikan file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Direct download</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Enkripsi end-to-end</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>WEB 3.0 support</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Layanan dukungan</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Pemangilan API</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tanpa iklan</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Content Delivery Network (CDN)</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>StasiunFile Card</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
              </ul>
              <div className={styles.btn}>
                <button>Pilih Paket</button>
              </div>
            </div>
            <div className={clsx(styles.table, styles.premium)}>
              <div className={styles.ribbon}>
                <span>Recommend</span>
              </div>
              <div className={clsx(styles.priceSection, "mb-3")}>
                <div className={styles.priceArea}>
                  <div className={styles.innerArea}>
                    <span className={styles.text}>Rp</span>
                    <span className={styles.price}>59</span>
                    <span>k</span>
                  </div>
                </div>
              </div>
              <div className={styles.packageName}></div>
              <ul className={styles.features}>
                <li>
                  <span className={styles.listName}>Penyimpanan online <b className="purple-text">2TB</b></span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>File manager</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>One time file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Kustom kode file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur limit downloadan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur kedaluwarsa downloadan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Amankan file dengan password</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Batas upload file 5GB/hari</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Maksimal ukuran upload 1GB/file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tidak ada batasan membagikan file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Direct download</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Enkripsi end-to-end</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>WEB 3.0 support</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Layanan dukungan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Pemanggilan API 1000/hari</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tanpa iklan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Content Delivery Network (CDN)</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>StasiunFile Card</span>
                  <span className={clsx(styles.icon, styles.cross)}>
                    <i className="gg-close"></i>
                  </span>
                </li>
              </ul>
              <div className={styles.btn}>
                <button>Pilih Paket</button>
              </div>
            </div>
            <div className={clsx(styles.table, styles.ultimate)}>
              <div className={clsx(styles.priceSection, "mb-3")}>
                <div className={styles.priceArea}>
                  <div className={styles.innerArea}>
                    <span className={styles.text}>Rp</span>
                    <span className={styles.price}>99</span>
                    <span>k</span>
                  </div>
                </div>
              </div>
              <div className={styles.packageName}></div>
              <ul className={styles.features}>
                <li>
                  <span className={styles.listName}>Penyimpanan online <b className="purple-text">5 TB</b></span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>File manager</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>One time file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Kustom kode file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur limit downloadan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Atur kedaluwarsa downloadan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Amankan file dengan password</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tidak ada batasan upload harian</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Maksimal ukuran upload 5GB/file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tidak ada batasan membagikan file</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Direct download</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Enkripsi end-to-end</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>WEB 3.0 support</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Prioritas layanan dukungan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tidak ada batasan pemanggilan API</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Tanpa iklan</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>Content Delivery Network (CDN)</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
                <li>
                  <span className={styles.listName}>StasiunFile Card</span>
                  <span className={clsx(styles.icon, styles.check)}>
                    <i className="gg-check"></i>
                  </span>
                </li>
              </ul>
              <div className={styles.btn}>
                <button>Pilih Paket</button>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
