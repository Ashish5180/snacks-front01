'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Globe, Building, Users } from 'lucide-react'

export default function TermsConditionsPage() {
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
            <li className="text-vibe-brown font-medium">Terms & Conditions</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-vibe-cookie/20 rounded-full">
              <FileText className="h-8 w-8 text-vibe-brown" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vibe-brown">Terms & Conditions</h1>
              <p className="text-lg text-vibe-brown/70 mt-2">Legal terms governing your use of our website and services</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">
                <strong>Important:</strong> By using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* About Website */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">About Our Website</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                This website is owned by <strong>Vibebites</strong>. The business address of 
                Vibebites is <strong>Delhi, India</strong>.
              </p>
              <p>
                By using this website and/or placing an order with us, you consent to the 
                following terms and conditions:
              </p>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Copyright Notice</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Copyright © 2024 Vibebites</strong>
              </p>
              <p>
                All rights reserved. This website contains material which is owned by or 
                licensed to us. This material includes, but is not limited to, the design, 
                layout, look, appearance and graphics. Reproduction is prohibited other than 
                in accordance with the copyright notice, which forms part of these terms and conditions.
              </p>
            </div>
          </div>

          {/* Unauthorized Use */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Unauthorized Use</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-orange-800">
                <strong>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offence.</strong>
              </p>
            </div>
          </div>

          {/* Content & Information Accuracy */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Information Accuracy</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Product Information</h3>
                <p className="text-blue-700">
                  From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Information Changes</h3>
                <p className="text-yellow-700">
                  The information on this web site is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Limitation of Liability</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Disclaimer</h3>
                <div className="space-y-3 text-red-700">
                  <p>
                    Nothing in this website disclaimer will exclude or limit our liability for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Death or personal injury caused by negligence</li>
                    <li>Fraud or fraudulent misrepresentation</li>
                    <li>Matter which it would be illegal to exclude or limit liability</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Excluded Liabilities</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Subject to the paragraph above, we exclude all liability for loss or damage arising out of or in connection with your use of this website. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Direct, indirect or consequential loss</li>
                    <li>Loss of profits, income, revenue, use, production or anticipated savings</li>
                    <li>Loss of business, contracts, commercial opportunities or goodwill</li>
                    <li>Loss or corruption of any data, database or software</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Your Responsibilities</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Acceptable Use</h3>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use our website lawfully and appropriately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Provide accurate information when required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Respect intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Maintain confidentiality of account information</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Prohibited Activities</h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Unauthorized access or hacking attempts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Distribution of harmful or malicious content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Violation of applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Interference with website functionality</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Governing Law & Jurisdiction</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Indian Law</h3>
                <p className="text-purple-700">
                  Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.
                </p>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Dispute Resolution</h3>
                <p className="text-indigo-700">
                  We and you both agree that any dispute arising out of or in connection with this website shall be subject to the exclusive jurisdiction of the courts of Delhi, India.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Updates */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Changes to Terms</h2>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Terms Modification</h3>
              <p className="text-amber-700 mb-4">
                We reserve the right to revise these terms and conditions at any time without notice. By using this website, you are expected to review these terms on a regular basis.
              </p>
              <p className="text-sm text-amber-600">
                <strong>Last Updated:</strong> January 2024
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-vibe-brown mb-6">Questions About These Terms?</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:support@vibebites.shop" className="text-vibe-brown hover:underline">support@vibebites.shop</a></p>
                <p><strong>Phone:</strong> <a href="tel:8697380653" className="text-vibe-brown hover:underline">8697380653</a></p>
                <p><strong>Address:</strong> Delhi, India</p>
              </div>
            </div>
          </div>

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