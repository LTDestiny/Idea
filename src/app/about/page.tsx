import {
  Lightbulb,
  FlaskConical,
  Cpu,
  Wrench,
  Palette,
  Calculator,
  GraduationCap,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steamPillars = [
  {
    letter: "S",
    word: "Science",
    icon: FlaskConical,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950",
    border: "border-emerald-300 dark:border-emerald-700",
    description:
      "Explore the natural world through observation, experimentation, and the scientific method. Science is the foundation for understanding and solving real-world problems.",
  },
  {
    letter: "T",
    word: "Technology",
    icon: Cpu,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950",
    border: "border-blue-300 dark:border-blue-700",
    description:
      "Apply modern technologies — AI, IoT, Cloud Computing — to create innovative solutions, improve quality of life, and drive digital transformation.",
  },
  {
    letter: "E",
    word: "Engineering",
    icon: Wrench,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950",
    border: "border-orange-300 dark:border-orange-700",
    description:
      "Design, build, and optimize systems. Engineering combines logical thinking with creativity to turn ideas into real-world products.",
  },
  {
    letter: "A",
    word: "Art",
    icon: Palette,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950",
    border: "border-rose-300 dark:border-rose-700",
    description:
      "Art brings a humanistic, aesthetic, and creative perspective. UI/UX, graphic design, storytelling — all require art to convey meaningful messages.",
  },
  {
    letter: "M",
    word: "Mathematics",
    icon: Calculator,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950",
    border: "border-violet-300 dark:border-violet-700",
    description:
      "Mathematics is the universal language across all STEAM fields. From algorithms to data analysis, math helps us model and solve problems.",
  },
];

const universities = [
  {
    abbr: "TUT",
    fullName: "Tokyo University of Technology",
    country: "Japan 🇯🇵",
    description:
      "Tokyo University of Technology — one of Japan's leading universities in technology research, engineering, and innovation.",
  },
  {
    abbr: "IUH",
    fullName: "Industrial University of Ho Chi Minh City",
    country: "Vietnam 🇻🇳",
    description:
      "Industrial University of Ho Chi Minh City — a public multidisciplinary university emphasizing hands-on practice and real-world technology applications.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            STEAM
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A platform connecting STEAM ideas between students of two universities
          — where <strong>Science</strong>, <strong>Technology</strong>,{" "}
          <strong>Engineering</strong>, <strong>Art</strong> and{" "}
          <strong>Mathematics</strong> come together.
        </p>
      </section>

      {/* What is STEAM */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          What is STEAM?
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          <strong>STEAM</strong> stands for <strong>S</strong>cience,{" "}
          <strong>T</strong>echnology, <strong>E</strong>ngineering,{" "}
          <strong>A</strong>rt, <strong>M</strong>ath — an interdisciplinary
          education model combining 5 key fields to develop creative thinking,
          problem-solving, and innovation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steamPillars.map((pillar) => (
            <Card
              key={pillar.letter}
              className={`${pillar.bg} border ${pillar.border} hover:scale-105 transition-transform duration-200`}
            >
              <CardContent className="pt-6 text-center">
                <pillar.icon
                  className={`h-8 w-8 mx-auto mb-2 ${pillar.color}`}
                />
                <div className={`text-3xl font-black ${pillar.color}`}>
                  {pillar.letter}
                </div>
                <div className={`text-sm font-semibold ${pillar.color} mb-2`}>
                  {pillar.word}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partner Universities */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Partner Universities
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          <strong>GLOCAL STEAM</strong> is a collaborative platform between two
          universities: <strong>Tokyo University of Technology (TUT)</strong> in
          Japan and{" "}
          <strong>Industrial University of Ho Chi Minh City (IUH)</strong> in
          Vietnam. Together, they foster international GLOCAL STEAM
          collaboration and knowledge exchange.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {universities.map((uni) => (
            <Card
              key={uni.abbr}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black text-primary">
                    {uni.abbr}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {uni.country}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{uni.fullName}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {uni.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Through the <strong>GLOCAL STEAM</strong> platform, students from
            both universities can share ideas, find collaborators, and develop
            interdisciplinary projects together — breaking through language
            barriers and geographical distances.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Our Mission
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold mb-2">Share Ideas</h3>
              <p className="text-sm text-muted-foreground">
                Create a space where every GLOCAL STEAM idea can be heard,
                discussed, and developed — from AI and IoT to digital art.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">Connect & Collaborate</h3>
              <p className="text-sm text-muted-foreground">
                Help students find collaborators with matching skills and turn
                ideas into real-world projects together.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-3">🌏</div>
              <h3 className="font-semibold mb-2">International Bridge</h3>
              <p className="text-sm text-muted-foreground">
                Build a collaborative bridge between Vietnamese and Japanese
                students, creating opportunities for global learning and growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10 rounded-xl bg-muted/50 border">
        <h2 className="text-2xl font-bold mb-3">Ready to share your idea?</h2>
        <p className="text-muted-foreground mb-6">
          Explore GLOCAL STEAM ideas or share your own today!
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/" className="gap-2">
              Explore Ideas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ideas/new">Create New Idea</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
