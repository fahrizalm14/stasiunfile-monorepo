import "css.gg/icons/css/check.css";
import "css.gg/icons/css/close.css";

import clsx from "clsx";
import React from "react";

import styles from "./index.module.css";

export default function PriceFeatures(): JSX.Element {
  return (
    <section className={clsx("pt-2", styles.features)}>
      <h2 className="hero__title text--center">Harga Layanan</h2>
      <p className="hero__subtitle text--center mb-3">
        Berikut rincian harga layanan StasiunFile per bulan:
      </p>
      <div className="container">
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
                <span className={styles.listName}>One Selected Template</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>100% Responsive Design</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Credit Remove Permission</span>
                <span className={clsx(styles.icon, styles.cross)}>
                  <i className="gg-close"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Lifetime Template Updates</span>
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
                <span className={styles.listName}>Five Existing Templates</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>100% Responsive Design</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Credit Remove Permission</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Lifetime Template Updates</span>
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
                <span className={styles.listName}>All Existing Templates</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>100% Responsive Design</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Credit Remove Permission</span>
                <span className={clsx(styles.icon, styles.check)}>
                  <i className="gg-check"></i>
                </span>
              </li>
              <li>
                <span className={styles.listName}>Lifetime Template Updates</span>
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
