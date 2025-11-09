'use client'

import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const pricingTiers = [
  {
    name: 'Static Website',
    description: 'Perfect for portfolios and business sites',
    basePrice: '5,000',
    priceDetails: 'One-time payment',
    features: [
      'Up to 5 pages included',
      'Fully responsive design',
      'SEO optimized',
      'Contact form integration',
      'Social media integration',
      'Fast loading speed',
      'Domain setup assistance',
      'Basic analytics setup'
    ],
    highlighted: false,
    color: 'from-blue-600/15 to-purple-600/15'
  },
  {
    name: 'Full Stack Application',
    description: 'Dynamic web apps with database',
    basePrice: '15,000',
    priceDetails: 'Starting price',
    features: [
      'Everything in Static',
      'User authentication system',
      'Database integration',
      'Admin dashboard',
      'API development',
      'CRUD operations',
      'Email notifications',
      'Payment gateway setup',
      '3 months free support'
    ],
    highlighted: true,
    color: 'from-blue-600/20 to-purple-600/20'
  },
  {
    name: 'Enterprise Solution',
    description: 'Full-scale app with maintenance',
    basePrice: '30,000',
    priceDetails: '+ ₱3,000/mo support',
    features: [
      'Everything in Full Stack',
      'Custom feature development',
      'Advanced security',
      'Performance optimization',
      'Priority 24/7 support',
      'Monthly updates',
      'Server monitoring',
      'Automated backups',
      'Analytics & reporting'
    ],
    highlighted: false,
    color: 'from-blue-600/15 to-purple-600/15'
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-100 via-purple-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent dark:via-blue-500/10" />
      {/* Gradient orbs for light mode */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[20%] top-[15%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[15%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.2)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
            Pricing Plans
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transparent pricing for every project size. All plans include responsive design and modern development.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative transition-all duration-300 ${
                tier.highlighted
                  ? 'lg:-mt-4 lg:mb-4'
                  : ''
              }`}
            >
              <Card
                className={`relative h-full flex flex-col transition-all duration-300 bg-white/95 backdrop-blur-sm dark:bg-slate-900/80 ${
                  tier.highlighted
                    ? 'border-purple-400 shadow-2xl shadow-purple-500/30 dark:border-purple-500/50 dark:shadow-purple-500/20'
                    : 'border-blue-300 shadow-xl shadow-blue-300/30 hover:shadow-2xl hover:shadow-blue-400/40 hover:border-blue-400 dark:border-slate-800 dark:shadow-none dark:hover:shadow-lg'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
                    MOST POPULAR
                  </div>
                )}

                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-50 rounded-lg`} />

                <CardHeader className="relative pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative flex-grow pb-6">
                  {/* Pricing */}
                  <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">₱{tier.basePrice}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {tier.priceDetails}
                    </p>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative pt-6">
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 dark:from-blue-500 dark:to-purple-500'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                    }`}
                    size="lg"
                    onClick={() => {
                      // Scroll to contact section
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            All prices are in Philippine Peso (₱). Timeline and final cost depend on project scope.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need a custom solution? <a href="#contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Let's discuss your project</a>
          </p>
        </div>
      </div>
    </section>
  )
}
