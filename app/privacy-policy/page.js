'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, Shield, Eye, Cookie, Lock } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-vibe-brown/60">
            <li><Link href="/" className="hover:text-vibe-brown">Home</Link></li>
            <li>/</li>
            <li className="text-vibe-brown font-medium">Privacy Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-vibe-cookie/20 rounded-full">
              <Shield className="h-8 w-8 text-vibe-brown" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vibe-brown">Privacy Policy</h1>
              <p className="text-lg text-vibe-brown/70 mt-2">How we protect and use your information</p>
            </div>
          </div>
          
          <div className="bg-vibe-cookie/10 border border-vibe-cookie/30 rounded-lg p-4">
            <p className="text-sm text-vibe-brown">
              <strong>Last Updated:</strong> This privacy policy is effective as of the date of website usage.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Our Commitment to Your Privacy</h2>
            </div>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                This privacy policy sets out how <strong>Vibebites</strong> uses and protects any information that you give Vibebites when you visit their website and/or agree to purchase from them.
              </p>
              <p>
                Vibebites is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
              </p>
              <p>
                Vibebites may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Information We Collect</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-4 text-gray-700">We may collect the following information:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                  <span>Name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                  <span>Contact information including email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                  <span>Demographic information such as postcode, preferences and interests, if required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                  <span>Other information relevant to customer surveys and/or offers</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-vibe-brown mb-4">What We Do With The Information We Gather</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-vibe-brown mb-2">Internal Operations</h3>
                  <p className="text-sm text-gray-700">Internal record keeping and service improvement.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-vibe-brown mb-2">Product Enhancement</h3>
                  <p className="text-sm text-gray-700">We may use the information to improve our products and services.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-vibe-brown mb-2">Marketing Communications</h3>
                  <p className="text-sm text-gray-700">We may periodically send promotional emails about new products and special offers.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-vibe-brown mb-2">Market Research</h3>
                  <p className="text-sm text-gray-700">We may contact you for market research purposes via email, phone, fax or mail.</p>
                </div>
              </div>
              
              <p>We may use the information to customise the website according to your interests.</p>
              <p><strong>We are committed to ensuring that your information is secure.</strong> In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">How We Use Cookies</h2>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
              </p>
              <p className="text-gray-700">
                Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
              </p>
              <p className="text-gray-700">
                We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
              </p>
              <p className="text-gray-700">
                <strong>Overall, cookies help us provide you with a better website,</strong> by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
              </p>
              <p className="text-gray-700">
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
              </p>
            </div>
          </section>

          {/* Controlling Personal Information */}
          <section>
            <h2 className="text-2xl font-semibold text-vibe-brown mb-4">Controlling Your Personal Information</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vibe-cookie rounded-full flex items-center justify-center text-vibe-brown text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vibe-cookie rounded-full flex items-center justify-center text-vibe-brown text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:support@vibebites.shop" className="text-vibe-brown font-semibold hover:underline">support@vibebites.shop</a></span>
                </li>
              </ul>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
                <p className="text-gray-700">
                  <strong>We will not sell, distribute or lease your personal information to third parties</strong> unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-vibe-cookie/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-vibe-brown mb-4">Contact Us</h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                If you believe that any information we are holding on you is incorrect or incomplete, please contact us as soon as possible. We will promptly correct any information found to be incorrect.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-vibe-brown mb-2">Address</h3>
                  <p className="text-sm text-gray-700">
                    21 POLLOCK STREET, DAWOODI BOHRA JAMAAT TRUST,<br />
                    CHANDNEY CHAWK STREET,<br />
                    Kolkata, West Bengal, 700072
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-vibe-brown mb-2">Contact</h3>
                  <p className="text-sm text-gray-700">
                    Phone: <a href="tel:8697380653" className="text-vibe-brown font-semibold hover:underline">8697380653</a><br />
                    Email: <a href="mailto:support@vibebites.shop" className="text-vibe-brown font-semibold hover:underline">support@vibebites.shop</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-brown hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}