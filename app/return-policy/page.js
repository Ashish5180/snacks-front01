'use client'

import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { RotateCcw, CheckCircle, DollarSign, RefreshCw, AlertTriangle, XCircle, Shield } from 'lucide-react'

const ReturnPolicyPage = () => {
  const policyItems = [
    {
      icon: CheckCircle,
      title: "Eligibility for Returns",
      content: [
        "We accept returns within 3 days of the delivery date for most items.",
        "To be eligible for a return, items must be unused, in the same condition as received, and in the original packaging."
      ]
    },
    {
      icon: RotateCcw,
      title: "Return Process",
      content: [
        "To initiate a return, customers must contact our customer service team to obtain a return authorization.",
        "Once approved, customers will receive instructions on how to return the item(s).",
        "Return shipping costs are the responsibility of the customer, unless the return is due to an error on our part or a defective product."
      ]
    },
    {
      icon: DollarSign,
      title: "Refund Process",
      content: [
        "Refunds will be issued to the original payment method used for the purchase within 5-7 business days of receiving the returned item(s).",
        "Original shipping charges are non-refundable, except in cases where the return is due to an error on our part."
      ]
    },
    {
      icon: RefreshCw,
      title: "Exchanges",
      content: [
        "We offer direct exchanges if there is a defect in the product or goods are damaged during transit or if there is a size or fitting issue for the customer.",
        "Customers wishing to exchange an item must initiate a replacement for the desired item."
      ]
    },
    {
      icon: AlertTriangle,
      title: "Damaged or Defective Items",
      content: [
        "In the rare event that an item is received damaged or defective, customers must contact us within 48 hours of receiving the order.",
        "We will arrange for a replacement."
      ]
    },
    {
      icon: XCircle,
      title: "Non-Returnable Items",
      content: [
        "Certain items are not eligible for return due to hygiene or safety reasons.",
        "These include but are not limited to, perishable goods, personalized items, and intimate apparel."
      ]
    },
    {
      icon: Shield,
      title: "Refusal of Returns",
      content: [
        "We reserve the right to refuse returns that do not meet our return policy criteria or are not authorized through our customer service team."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-vibe-brown mb-4">
            Return Policy
          </h1>
          <p className="text-lg text-vibe-brown/70 max-w-2xl mx-auto">
            Your satisfaction is our priority. Learn about our straightforward return and refund process.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-vibe-cookie/20 border border-vibe-cookie rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-vibe-brown mt-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-vibe-brown mb-2">
                Important Notice
              </h3>
              <p className="text-vibe-brown/80">
                For damaged or defective items, please contact us within <strong>48 hours</strong> of receiving your order. 
                For all other returns, you have <strong>3 days</strong> from the delivery date to initiate a return.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policyItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-vibe-cookie/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-vibe-cookie rounded-full flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-vibe-brown" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-vibe-brown mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.content.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-vibe-brown/80 leading-relaxed">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Return Timeline */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-vibe-cookie/20">
          <h3 className="text-2xl font-semibold text-vibe-brown mb-6 text-center">
            Return Timeline
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-vibe-cookie rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-vibe-brown">1</span>
              </div>
              <h4 className="font-semibold text-vibe-brown mb-2">Contact Us</h4>
              <p className="text-sm text-vibe-brown/70">
                Within 3 days of delivery (48 hours for damaged items)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vibe-cookie rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-vibe-brown">2</span>
              </div>
              <h4 className="font-semibold text-vibe-brown mb-2">Ship Back</h4>
              <p className="text-sm text-vibe-brown/70">
                Follow return instructions and ship the item back
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vibe-cookie rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-vibe-brown">3</span>
              </div>
              <h4 className="font-semibold text-vibe-brown mb-2">Get Refund</h4>
              <p className="text-sm text-vibe-brown/70">
                Receive refund within 5-7 business days
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-vibe-cookie/20 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-2xl font-semibold text-vibe-brown mb-4">
            Need to Return an Item?
          </h3>
          <p className="text-vibe-brown/80 mb-6">
            Contact our customer service team to get started with your return. We&apos;re here to make the process as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-brown hover:text-white transition-colors duration-300"
            >
              Start Return Process
            </a>
            <a
              href="/track-order"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-vibe-brown font-semibold rounded-full border border-vibe-cookie hover:bg-vibe-cookie transition-colors duration-300"
            >
              Track Your Order
            </a>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ReturnPolicyPage