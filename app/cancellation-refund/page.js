'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, RotateCcw, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function CancellationRefundPage() {
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
            <li className="text-vibe-brown font-medium">Cancellation & Refund Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-vibe-cookie/20 rounded-full">
              <RotateCcw className="h-8 w-8 text-vibe-brown" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vibe-brown">Cancellation & Refund Policy</h1>
              <p className="text-lg text-vibe-brown/70 mt-2">Our liberal policy to help you with cancellations and refunds</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Customer-Friendly:</strong> Vibebites believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Cancellation Policy</h2>
            </div>

            <div className="space-y-6">
              {/* Timeline Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Cancellation Timeline</h3>
                </div>
                <p className="text-blue-700">
                  <strong>Cancellations will be considered only if the request is made within 2 days of placing the order.</strong> However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                </p>
              </div>

              {/* Restrictions */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-800">Cancellation Restrictions</h3>
                </div>
                <p className="text-orange-700">
                  <strong>Vibebites does not accept cancellation requests for perishable items</strong> like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                </p>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-vibe-brown" />
              <h2 className="text-2xl font-semibold text-vibe-brown">Refund Policy</h2>
            </div>

            <div className="space-y-6">
              
              {/* Damaged/Defective Items */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-vibe-brown mb-3">Damaged or Defective Items</h3>
                <p className="text-gray-700 mb-4">
                  In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end.
                </p>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-700 text-sm">
                    <strong>Important:</strong> This should be reported within 2 days of receipt of the products.
                  </p>
                </div>
              </div>

              {/* Product Not As Expected */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-vibe-brown mb-3">Product Not As Expected</h3>
                <p className="text-gray-700 mb-4">
                  In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 days of receiving the product.
                </p>
                <p className="text-gray-700">
                  The Customer Service Team after looking into your complaint will take an appropriate decision.
                </p>
              </div>

              {/* Warranty Items */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-vibe-brown mb-3">Warranty Items</h3>
                <p className="text-gray-700">
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                </p>
              </div>

              {/* Refund Processing Time */}
              <div className="bg-vibe-cookie/10 border border-vibe-cookie/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-vibe-brown" />
                  <h3 className="text-lg font-semibold text-vibe-brown">Refund Processing Time</h3>
                </div>
                <p className="text-vibe-brown">
                  <strong>In case of any Refunds approved by Vibebites, it&apos;ll take 9-15 days for the refund to be processed to the end customer.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Process Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-vibe-brown mb-6">How to Request Cancellation or Refund</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-vibe-brown mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Reach out within 2 days of order placement or product receipt</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-vibe-brown mb-2">Review Process</h3>
                <p className="text-sm text-gray-600">Our team will review your request and check with merchants if needed</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-vibe-brown mb-2">Resolution</h3>
                <p className="text-sm text-gray-600">Approved refunds processed within 9-15 days</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-vibe-brown mb-6">Contact Customer Service</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-vibe-brown mb-4">For Cancellation & Refund Requests</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-vibe-brown rounded-full"></span>
                    <span className="text-gray-700">Email: <a href="mailto:support@vibebites.shop" className="text-vibe-brown font-semibold hover:underline">support@vibebites.shop</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-vibe-brown rounded-full"></span>
                    <span className="text-gray-700">Phone: <a href="tel:8697380653" className="text-vibe-brown font-semibold hover:underline">8697380653</a></span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-vibe-brown mb-4">Information to Provide</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                    <span>Order number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                    <span>Product details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                    <span>Reason for cancellation/refund</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-vibe-brown rounded-full mt-2 flex-shrink-0"></span>
                    <span>Photos (for damaged items)</span>
                  </li>
                </ul>
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