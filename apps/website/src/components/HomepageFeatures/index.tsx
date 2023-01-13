import clsx from "clsx";
import React from "react";

import PriceFeatures from "../PriceFeatures";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "One Time File",
    Svg: require("@site/static/img/undraw_season_change_f99v.svg").default,
    description: (
      <>
        File akan terhapus otomatis apabila sudah terunduh satu kali, fitur ini cocok untuk
        mengelola file rahasia yang sangat penting.
      </>
    ),
  },
  {
    title: "Easy to Share",
    Svg: require("@site/static/img/undraw_link_shortener_mvf6.svg").default,
    description: (
      <>
        Kamu dapat membuat url sesuai yang kamu inginkan, dengan format seperti ini{" "}
        <code className="text-italic">https://sif.id/[teks-kustom]</code> agar lebih mudah lagi
        untuk di Bagikan.
      </>
    ),
  },
  {
    title: "Flexible File Setup",
    Svg: require("@site/static/img/undraw_select_re_3kbd.svg").default,
    description: (
      <>
        Kamu dapat mengatur maksimal jumlah download, waktu download, enkripsi{" "}
        <code>end to end</code> dan bahkan kamu dapat menambahkan password untuk mengunci file kamu.
      </>
    ),
  },
  {
    title: "Content Delivery Network",
    Svg: require("@site/static/img/undraw_static_website_re_x70h.svg").default,
    description: (
      <>
        File yang kamu upload bisa di muat langsung ke dalam website atau platform lainnya (file
        statis untuk website).
      </>
    ),
  },
  {
    title: "End to End Encryption",
    Svg: require("@site/static/img/undraw_secure_files_re_6vdh.svg").default,
    description: (
      <>
        <b>StasiunFile</b> memberikan opsi enkripsi end to end, yang berfungsi untuk mengamankan
        file kamu, bahkan sumber daya <b>StasiunFile</b> pun tidak mampu membukanya.
      </>
    ),
  },
  {
    title: "WEB 3.0 Support",
    Svg: require("@site/static/img/undraw_ethereum_re_0m68.svg").default,
    description: (
      <>
        <b>StasiunFile</b> mengadopsi beberapa teknologi dari blockchain/crypto seperti{" "}
        <code>12 frasa mnemonik</code>, <code>MetaMask</code> dan lainnya, sehingga menjadikannya
        sangat aman, dan kontrol penuh ada di tangan Kamu.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3 className="purple-text">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <section className={clsx("hero hero--secondary", styles.features)}>
        <div className="container">
          <div className="row px-3">
            <h2 className="hero__title">
              Kenapa <b className="purple-text">upload </b>file menggunakan{" "}
              <b className="purple-text">StasiunFile</b>?
            </h2>
            <p className="hero__subtitle">
              Tanpa login{" "}
              <span className="purple-text text-italic">
                (atau tidak perlu mendaftar/membuat akun StasiunFile){" "}
              </span>
              kamu bisa mengupload file dan langsung bisa membagikan linknya, bahkan kamu bisa
              mengatur <span className="purple-text text-italic">berapa jumlah</span> dan{" "}
              <span className="purple-text text-italic">waktu kedaluwrsa</span> downloadan yang di
              inginkan. Sangat <span className="purple-text text-italic">cocok</span> untuk kamu
              yang sering memakan waktu buka{" "}
              <span className="purple-text text-italic">whatsapp web</span> hanya untuk mengirim
              file ke handphone. Atau anda ingin mendapatkan fitur yang lebih lengkap dan super inovatif hanya dengan syarat gabung dengan kami.
            </p>
            <button className={clsx("button button--primary button--lg text-center")}>
              Daftar sekarang, GRATIS!
            </button>
          </div>
        </div>
      </section>

      <PriceFeatures />

      <section className={styles.features}>
        <div className="container">
          <h2 className="hero__title text--center">Fitur Cloud Storage Paling Inovatif</h2>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
