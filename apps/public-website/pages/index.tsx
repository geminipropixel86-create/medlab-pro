import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>MedLab Pro - Modern Laboratory Management Platform</title>
        <meta name="description" content="Complete laboratory management solution for clinics, hospitals, and diagnostic centers." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-medlab-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Modern Lab Management{' '}
              <span className="text-primary-600">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-6">
              Complete platform for managing patients, tests, results, and billing. 
              Used by 500+ labs worldwide to streamline operations and improve patient care.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/contact" className="btn-primary">Get Started</Link>
              <Link href="/services" className="btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-desc mx-auto">Complete lab management platform with patient portal, automated notifications, and powerful analytics.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'Patient Management', desc: 'Register, track, and manage patient records with ease. Complete history at your fingertips.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { title: 'Test & Results', desc: 'Streamlined test ordering, sample tracking, and result entry with automated patient notifications.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { title: 'Billing & Reports', desc: 'Generate invoices, track payments, and get detailed analytics on your lab performance.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: 'Active Labs', value: '500+' },
              { label: 'Patients Served', value: '50K+' },
              { label: 'Tests Processed', value: '1M+' },
              { label: 'Countries', value: '15+' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
                <p className="text-primary-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="section-title">Ready to Transform Your Lab?</h2>
          <p className="section-desc mx-auto">Join 500+ labs already using MedLab Pro to streamline operations and improve patient care.</p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/contact" className="btn-primary">Start Free Trial</Link>
            <Link href="/services" className="btn-secondary">View Pricing</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}