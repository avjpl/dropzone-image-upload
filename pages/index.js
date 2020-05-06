import Head from 'next/head'

import Dropzone from '../components/Dropzone';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Image Upload</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dropzone />
      </main>
    </div>
  )
}
