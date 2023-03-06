import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React, { FC, useState } from "react";

import styles from "./index.module.css";

interface HomepageHeaderProps {
  onClick(): void;
}

const HomepageHeader: FC<HomepageHeaderProps> = ({ onClick }) => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx("container", styles.heroBanner)}>
      <div className="row">
        <div className={clsx("col col--6")}>
          <img
            className={styles.imageIllustrator}
            src={useBaseUrl("/img/undraw_uploading_re_okvh.svg")}
            alt="ilustrasi upload file"
            width={250}
          />
          <h1 className="hero__title purple-text">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
        <div className={clsx("col col--6")}>
          <img src={useBaseUrl("/img/logo.png")} alt="logo stasiunfile" width={80} />
          <p className="text--center text-italic">
            "Download sangat mudah sesuai kode yang kamu inginkan."
          </p>
          {/* <div className="row px-1">
            <input
              className={clsx("col col--8", "input mx-1")}
              type="text"
              title="Download via kode file"
              placeholder="ketik/paste kode file disini..."
            />
            <button
              className={clsx("col col--3", "button button--primary button--md")}
              onClick={() => onClick()}
            >
              Download
            </button>
          </div> */}
          <div className="card mt-1 pt-1">
            <span className={styles.icons}>📤</span>
            <div className={styles.buttons}>
              <input
                title="Upload file disini"
                className="button button--secondary button--sm"
                type={"file"}
              />
            </div>
            <p className="p-1 text-center">
              <strong className="purple-text">Upload</strong> file gratis hingga{" "}
              <strong className="purple-text">1GB</strong> sebanyak yang kamu, dan langsung dapatkan
              link <strong className="purple-text">download</strong> untuk di Bagikan.
            </p>
            <p className="text-start px-1 purple-text ">
              *Semua file dienkripsi saat disimpan di server StasiunFile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const openModalDownload = () => setVisible(!visible);

  return (
    <Layout
      title={`Bagikan file dengan cara yang paling super mudah`}
      description="Cara paling mudah untuk mengupload & membagikan file Kamu"
    >
      <HomepageHeader onClick={() => openModalDownload()} />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
