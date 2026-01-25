import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle2, AlertCircle, Loader2, User, Mail, Phone, MessageSquare, FileText, ChevronDown } from "lucide-react"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kļūda nosūtot ziņu. Lūdzu, mēģiniet vēlreiz.');
      }

      onSubmit?.(formData)
      setFormSubmitted(true)

      setTimeout(() => {
        setFormData(defaultFormData)
        setFormSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kļūda nosūtot ziņu. Lūdzu, mēģiniet vēlreiz.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative bg-white shadow-xl overflow-hidden">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

      <div className="p-6 sm:p-8">
        {formSubmitted ? (
          <div className="text-center py-12">
            <div className="relative inline-flex">
              <div className="h-20 w-20 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-teal-600" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-teal-500 rounded-full flex items-center justify-center animate-bounce">
                <Send className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-teal-900 mb-3">Ziņa nosūtīta!</h3>
            <p className="text-zinc-600 max-w-sm mx-auto">
              Paldies, ka sazinājāties ar mums. Mēs jums drīzumā atbildēsim.
            </p>
            <div className="mt-6 h-1 w-16 bg-teal-600 mx-auto skew-x-[-12deg]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-800 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-600" />
                  Jūsu vārds *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors h-11"
                  placeholder="Ievadiet savu vārdu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-600" />
                  E-pasta adrese *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors h-11"
                  placeholder="Ievadiet savu e-pastu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-600" />
                  Tālruņa numurs
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors h-11"
                  placeholder="Ievadiet savu tālruņa numuru"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-600" />
                  Mani interesē
                </Label>
                <div className="relative">
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full h-11 rounded-md border border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors px-3 pr-10 appearance-none cursor-pointer"
                  >
                    <option value="general">Vispārīgs jautājums</option>
                    <option value="membership">Dalība</option>
                    <option value="sponsorship">Sponsorēšana</option>
                    <option value="volunteer">Brīvprātīgais darbs</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                Tēma *
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors h-11"
                placeholder="Ievadiet tēmu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-zinc-700 font-semibold text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                Jūsu ziņa *
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="border-zinc-200 bg-gray-50 text-zinc-800 focus:border-teal-500 focus:ring-teal-500 focus:bg-white transition-colors resize-none"
                placeholder="Šeit ievadiet savu ziņu..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full sm:w-auto px-8 py-3.5 font-bold tracking-wide transform skew-x-[-12deg] transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting
                    ? 'bg-teal-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700'
                } text-white`}
              >
                <span className="transform skew-x-[12deg] inline-flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      NOSŪTA...
                    </>
                  ) : (
                    <>
                      NOSŪTĪT ZIŅU
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 pt-2">
              * Obligāti aizpildāmie lauki
            </p>
          </form>
        )}
      </div>
    </div>
  )
} 