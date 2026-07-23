import Head from 'next/head';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head><title>About Us - MedLab Pro</title></Head>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="section-title">About MedLab Pro</h1>
          <p className="section-desc">
            We are building the future of laboratory management. Our platform empowers labs of all sizes to deliver faster, more accurate results with modern tools.
          </p>

          <div className="mt-12 space-y-8">
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">To make laboratory management accessible, efficient, and error-free for every diagnostic center worldwide. We believe modern labs deserve modern tools.</p>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600">Founded by a team of healthcare technologists and lab professionals, MedLab Pro was born from the frustration of using outdated systems in modern diagnostic labs. We set out to build a platform that combines the power of cloud computing with the specific needs of laboratory workflows.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-2xl font-bold text-primary-600">2020</p>
                <p className="text-sm text-gray-600 mt-1">Founded</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-2xl font-bold text-primary-600">500+</p>
                <p className="text-sm text-gray-600 mt-1">Active Labs</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-2xl font-bold text-primary-600">15+</p>
                <p className="text-sm text-gray-600 mt-1">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}