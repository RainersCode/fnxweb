"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react"
import MainLayout from "@/components/main-layout"

export default function TeamPage() {
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("players")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const players = [
    {
      name: "James Wilson",
      position: "Prop",
      number: 1,
      image: "/placeholder.svg?height=400&width=300&text=Player 1",
      bio: "Team captain with 10 years of experience. Known for powerful scrummaging and leadership on the field.",
    },
    {
      name: "Michael Thompson",
      position: "Hooker",
      number: 2,
      image: "/placeholder.svg?height=400&width=300&text=Player 2",
      bio: "Joined the club in 2020. Excellent line-out thrower and mobile around the park.",
    },
    {
      name: "David Roberts",
      position: "Lock",
      number: 4,
      image: "/placeholder.svg?height=400&width=300&text=Player 3",
      bio: "Standing at 6'6\", David is our line-out specialist and a powerful force in the scrum.",
    },
    {
      name: "Thomas Brown",
      position: "Flanker",
      number: 6,
      image: "/placeholder.svg?height=400&width=300&text=Player 4",
      bio: "Known for his incredible work rate and tackling ability. A true workhorse in the back row.",
    },
    {
      name: "Ryan Johnson",
      position: "Scrum-half",
      number: 9,
      image: "/placeholder.svg?height=400&width=300&text=Player 5",
      bio: "Quick service and excellent game management. The link between forwards and backs.",
    },
    {
      name: "Chris Williams",
      position: "Fly-half",
      number: 10,
      image: "/placeholder.svg?height=400&width=300&text=Player 6",
      bio: "Playmaker with a strong kicking game. Controls the tempo and direction of our attack.",
    },
  ]

  const coaches = [
    {
      name: "Richard Davies",
      role: "Head Coach",
      image: "/placeholder.svg?height=400&width=300&text=Coach 1",
      bio: "Former professional player with 15 years of coaching experience. Focuses on technical skills and game strategy.",
    },
    {
      name: "Sarah Jenkins",
      role: "Strength & Conditioning",
      image: "/placeholder.svg?height=400&width=300&text=Coach 2",
      bio: "Sports science specialist ensuring our players are in peak physical condition throughout the season.",
    },
    {
      name: "Mark Stevens",
      role: "Assistant Coach",
      image: "/placeholder.svg?height=400&width=300&text=Coach 3",
      bio: "Specializes in forward play and set-piece strategy. Former international player.",
    },
  ]

  return (
    <MainLayout currentPage="TEAM">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Team Photo')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: "transform 0.1s linear",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80 z-0" />

          {/* Decorative elements */}
          <div className="absolute top-20 right-[10%] w-32 h-32 bg-teal-500/20 rounded-full blur-xl z-0"></div>
          <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-teal-700/10 rounded-full blur-xl z-0"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
                <span className="text-white">OUR</span>
                <span className="text-white font-light italic ml-2">TEAM</span>
              </h1>
              <div className="h-1 w-32 bg-white mx-auto mb-6 transform skew-x-[-12deg]"></div>
              <p className="text-xl text-teal-100">
                Meet the dedicated players and coaching staff who make Riverside Rugby Club what it is today.
              </p>
            </div>
          </div>
        </section>

        {/* Team Info Section */}
        <section className="py-16 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <Card
                className="overflow-hidden border-none shadow-md transform hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Club History</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-zinc-600">
                      Founded in 1985, Riverside RFC has a proud history of developing local talent and competing at the
                      regional level. The club has won 3 regional championships and continues to grow year on year.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="overflow-hidden border-none shadow-md transform hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Training Schedule</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2 text-zinc-600">
                      <li className="flex justify-between">
                        <span>Tuesday</span>
                        <span className="font-medium">7:00 PM - 9:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Thursday</span>
                        <span className="font-medium">7:00 PM - 9:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday (Match Day)</span>
                        <span className="font-medium">2:30 PM Kickoff</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="overflow-hidden border-none shadow-md transform hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Home Ground</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-zinc-600 mb-4">
                      Riverside Park, Main Street
                      <br />
                      Riverside Town, RT1 2AB
                    </p>
                    <p className="text-zinc-600">
                      Our facilities include a full-size pitch, training area, clubhouse with bar, and changing rooms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-16 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="inline-block relative">
                <span className="text-4xl font-black tracking-tighter text-teal-900 uppercase">MEET</span>
                <span className="text-4xl font-light italic tracking-wide text-teal-700 uppercase ml-2">THE SQUAD</span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-800 skew-x-[-12deg]"></span>
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                className={`px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 ${
                  activeTab === "players"
                    ? "bg-teal-800 text-white hover:bg-teal-900"
                    : "bg-white text-teal-800 hover:text-teal-900 hover:bg-white border border-teal-800"
                }`}
                onClick={() => setActiveTab("players")}
              >
                <span className="transform skew-x-[12deg] inline-flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players
                </span>
              </button>
              <button
                className={`px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 ${
                  activeTab === "coaches"
                    ? "bg-teal-800 text-white hover:bg-teal-900"
                    : "bg-white text-teal-800 hover:text-teal-900 hover:bg-white border border-teal-800"
                }`}
                onClick={() => setActiveTab("coaches")}
              >
                <span className="transform skew-x-[12deg] inline-flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Coaching Staff
                </span>
              </button>
            </div>

            {/* Players Grid */}
            {activeTab === "players" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-white overflow-hidden shadow-md transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="relative h-80">
                      <Image src={player.image || "/placeholder.svg"} alt={player.name} fill className="object-cover" />
                      <div className="absolute top-0 right-0 bg-teal-800 text-white text-2xl font-bold w-12 h-12 flex items-center justify-center transform skew-x-[-12deg] -mr-2">
                        <span className="transform skew-x-[12deg]">{player.number}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-teal-900">{player.name}</h3>
                      <p className="text-teal-700 font-medium mb-4">{player.position}</p>
                      <p className="text-zinc-600 text-sm">{player.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coaches Grid */}
            {activeTab === "coaches" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coaches.map((coach, index) => (
                  <div
                    key={index}
                    className="bg-white overflow-hidden shadow-md transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="relative h-80">
                      <Image src={coach.image || "/placeholder.svg"} alt={coach.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-teal-900">{coach.name}</h3>
                      <p className="text-teal-700 font-medium mb-4">{coach.role}</p>
                      <p className="text-zinc-600 text-sm">{coach.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}

