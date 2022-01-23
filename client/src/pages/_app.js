import '../styles/globals.css'
import {Fragment} from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
      <Fragment>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Fragment>
  )
}

export default MyApp
