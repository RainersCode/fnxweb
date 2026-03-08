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
    <div className="bg-white overflow-hidden">
      <div className="p-6 sm:p-8">
        {formSubmitted ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-teal-700" />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-[#111] mb-3">Ziņa nosūtīta!</h3>
            <p className="font-body text-sm text-[#666] max-w-sm mx-auto">
              Paldies, ka sazinājāties ar mums. Mēs jums drīzumā atbildēsim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-800 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-700" />
                  Jūsu vārds *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors h-11 rounded-none"
                  placeholder="Ievadiet savu vārdu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-700" />
                  E-pasta adrese *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors h-11 rounded-none"
                  placeholder="Ievadiet savu e-pastu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-700" />
                  Tālruņa numurs
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors h-11 rounded-none"
                  placeholder="Ievadiet savu tālruņa numuru"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-700" />
                  Mani interesē
                </Label>
                <div className="relative">
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full h-11 border border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors px-3 pr-10 appearance-none cursor-pointer rounded-none"
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
              <Label htmlFor="subject" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-700" />
                Tēma *
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors h-11 rounded-none"
                placeholder="Ievadiet tēmu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#111] font-cond text-xs font-bold tracking-[1.5px] uppercase flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-700" />
                Jūsu ziņa *
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="border-zinc-200 bg-[#f5f5f5] text-[#111] focus:border-teal-700 focus:ring-teal-700 focus:bg-white transition-colors resize-none rounded-none"
                placeholder="Šeit ievadiet savu ziņu..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase px-9 py-3.5 transition-colors duration-200 ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-teal-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    NOSŪTA...
                  </>
                ) : (
                  <>
                    NOSŪTĪT ZIŅU
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <p className="font-body text-xs text-[#999] pt-2">
              * Obligāti aizpildāmie lauki
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
