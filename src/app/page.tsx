"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="bg-background text-primary min-h-screen antialiased">
      <Header />

        <main className="max-w-7xl mx-auto px-6 lg:px-8">
    {/* HERO */}
    <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[78vh] lg:min-h-screen py-16">
      {/* LEFT - large type + text */}
      <div className="lg:col-span-7 order-2 lg:order-1">
        <div className="max-w-2xl">
          {/* Decorative huge word */}
          <div className="pointer-events-none absolute -translate-x-6 lg:relative lg:translate-x-0 lg:mb-6 select-none hidden lg:block">
            <h2 className="text-[8rem] leading-[0.8] font-serif font-extrabold text-primary"><span className="opacity-70">C</span><span className="opacity-10">AMÉLIA</span></h2>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 selection:bg-primary selection:text-background"
          >
            Seu banho merece o carinho e o aroma dos nossos sabonetes artesanais
          </motion.h1>

          {/* Subtitle */}
          <p className="text-lg text-primary mb-6 selection:bg-primary selection:text-background">
          </p>

          <div className="flex items-center gap-4">
            <a href="https://wa.me/5581985626046" className="inline-flex items-center rounded-md px-5 py-3 bg-primary text-background selection:bg-background selection:text-primary font-semibold shadow-md hover:brightness-95 transition">
              Catálogo
            </a>

            <a href="#about" className="text-sm text-primary hover:underline selection:bg-primary selection:text-background">Sobre o Produto</a>
          </div>
        </div>
      </div>

      {/* RIGHT - hero image */}
      <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[420px]"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl bg-primary text-background selection:bg-background selection:text-primary">
            <Image src="/images/hero-image.png" alt="Sabonete Camélia" width={760} height={760} className="object-cover" />
          </div>
        </motion.div>
      </div>
    </section>

    {/* HOW WE CREATE - two column */}
    <section id="about" className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <h3 className="text-2xl font-semibold mb-4 selection:bg-primary selection:text-background">Como Criamos Nossos Sabonetes</h3>
          <p className="text-primary mb-6 selection:bg-primary selection:text-background">
            Nosso sabonete é feito com 100% de ingredientes naturais, livre de químicos nocivos, e elaborado com cuidado para garantir a mais alta qualidade. Cada barra é projetada para nutrir e hidratar sua pele, deixando-a macia e suave.
          </p>

          <a className="inline-flex items-center rounded-md px-4 py-2 bg-primary text-background selection:bg-background selection:text-primary border border-gray-200 shadow-sm hover:brightness-95 transition" href="#">
            Saiba mais
          </a>
        </div>

        <div className="lg:col-span-7 flex flex-col md:grid md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden">
            <Image src="/images/how-we-create.png" alt="Pastilhas de sabonete" width={700} height={700} className="object-cover w-full h-full" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg overflow-hidden h-full bg-primary text-background selection:bg-background selection:text-primary border border-gray-100 p-4">
              <h4 className="font-medium mb-2">Origem sustentável</h4>
              <p className="text-sm text-background">Troque o químico pelo natural. Sabonetes sustentáveis que transformam seu banho em um ato de amor ao meio ambiente.</p>
            </div>

            <div className="rounded-lg overflow-hidden h-full bg-primary text-background selection:bg-background selection:text-primary border border-gray-100 p-4">
              <h4 className="font-medium mb-2">Feito à mão com cuidado</h4>
              <p className="text-sm text-background">Cada barra é artesanal para preservar as propriedades únicas de cada ingrediente.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* WHY CHOOSE - grid */}
    <section className="py-12">
      <h3 className="text-center text-2xl font-semibold mb-8 selection:bg-primary selection:text-background">Por Que Escolher Nossos Sabonetes?</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "100% Natural", text: "Ingredientes naturais suaves para a pele." },
          { title: "Embalagem Ecológica", text: "Embalado e enviado de forma sustentável." },
          { title: "Livre de Crueldade", text: "Nunca testado em animais." },
          { title: "Artesanal", text: "Lotes feitos com carinho." },
        ].map((card) => (
          <div key={card.title} className="bg-primary text-background selection:bg-background selection:text-primary p-6 rounded-lg border border-gray-100 shadow-sm">
            <h4 className="font-semibold mb-2">{card.title}</h4>
            <p className="text-sm text-background">{card.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* TESTIMONIALS (minimal) */}
    {/* <section id="testimonials" className="py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-4 selection:bg-primary selection:text-background">O Que Nossos Clientes Dizem</h3>
        <p className="text-primary mb-8 selection:bg-primary selection:text-background">Avaliações reais de nossos clientes que amam a Camélia Saboaria Artesanal.</p>

        <div className="bg-primary text-background selection:bg-background selection:text-primary p-6 rounded-lg shadow">
          <p className="text-background">“Absolutamente o melhor sabonete que já usei — cheira divinamente e deixa minha pele macia.”</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200" />
            <div>
              <div className="font-medium">Leslie Alexander</div>
              <div className="text-sm text-background">Comprador Verificado</div>
            </div>
          </div>
        </div>
      </div>
    </section> */}

    {/* FAQ (accordion) */}
    <section id="faq" className="py-12">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6 selection:bg-primary selection:text-background">Perguntas frequentes</h3>
        <div className="space-y-3">
          {[
            { question: "Seus sabonetes são adequados para peles sensíveis?", answer: "Sim, para todos os tipos de peles, escolha o ideal para a sua." },
            { question: "Vocês entregam para o Brasil inteiro?", answer: "Sim, contate-nos e consulte os valores de frete!" },
          ].map(({question, answer}, i) => (
            <details key={question} className="bg-primary text-background selection:bg-background selection:text-primary p-4 rounded-lg border border-gray-100">
              <summary className="cursor-pointer font-medium">{question}</summary>
              <p className="mt-2 text-sm text-background">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="py-12 mt-12 selection:bg-primary selection:text-background">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md flex items-center justify-center text-white font-bold">
                <Image src="/images/logo.png" alt="Sabonete Camélia" width={100} height={100} className="object-cover" />
            </div>
            <div>
              <div className="font-semibold">Camélia Saboaria Artesanal</div>
              <div className="text-sm text-primary">Sabonetes artesanais & cuidados com a pele</div>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <a href="#" className="text-sm text-primary hover:underline">Início</a>
            <a href="#about" className="text-sm text-primary hover:underline">Sobre o Produto</a>
            <a href="https://bio.site/cameliasaboariarte" className="text-sm text-primary hover:underline">Contato</a>
          </nav>
        </div>

        <p className="text-sm text-primary text-center mt-6">© {new Date().getFullYear()} Camélia Saboaria Artesanal. Todos os direitos reservados.</p>
      </div>
    </footer>
  </main>
</div>
  );
}
