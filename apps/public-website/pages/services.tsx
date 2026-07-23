import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Services() {
  const services = [
    { title: 'Lab Management Dashboard', desc: 'Complete web-based dashboard for managing patients, ordering tests, entering results, and tracking billing.', features: ['Patient registration & history', 'Test ordering & tracking', 'Result entry & verification', 'Billing & invoice generation'] },
    { title: 'Patient Mobile App', desc: 'Native mobile app for patients to view test results, receive notifications, and manage their health records.', features: ['Real-time result notifications', 'Test history & reports', 'Multi-language support', 'Secure authentication'] },
    { title: 'Automated Notifications', desc: 'Multi-channel notifications via WhatsApp, SMS, Email, and push notifications for test results and reminders.', features: ['WhatsApp Business integration', 'SMS fallback gateway', 'Email reports', 'Push notifications'] },
    { title: 'Analytics & Reports', desc: 'Detailed analytics dashboards with revenue tracking, test trends, and operational insights.', features: ['Revenue analytics', 'Test volume trends', 'Lab performance metrics', 'Exportable reports'] },
  ];

  return (
    <Layout>
      <Head><title>Services - MedLab Pro</title></Head>
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="section-title">Our Services</h1>
            <p className="section-desc mx-auto">Complete suite of tools for modern laboratory management.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl border p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-medlab-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary">Get Started Today</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}