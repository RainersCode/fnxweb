import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  interest: string
}

const defaultFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  interest: "general",
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormSubmitted(true)
    setTimeout(() => {
      setFormData(defaultFormData)
      setFormSubmitted(false)
    }, 5000)
  }

  return (
    <Card
      className="mt-8 overflow-hidden border-none shadow-md"
      style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 95%)" }}
    >
      <CardContent className="p-6">
        {formSubmitted ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-teal-900 mb-2">Message Sent!</h3>
            <p className="text-zinc-600">Thank you for contacting us. We&apos;ll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">I&apos;m interested in</Label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full rounded-md border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="membership">Membership</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="volunteer">Volunteering</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="border-zinc-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white"
              >
                <span className="transform skew-x-[12deg] inline-flex items-center">SEND MESSAGE</span>
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 