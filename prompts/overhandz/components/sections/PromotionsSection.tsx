"use client"
// "use client" needed: uses Framer Motion for scroll animations.

import { motion } from "framer-motion"
import Image from "next/image"
import SectionWrapper from "@/components/ui/SectionWrapper"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import { promotions } from "@/components/data/promotions"
import type { Dict, Lang } from "@/lib/getDictionary"

interface PromotionsSectionProps {
  dict: Dict["promotions"];
  lang: Lang;
}

export default function PromotionsSection({ dict, lang }: PromotionsSectionProps) {
  return (
    <section className="py-20 px-6 md:py-36 md:px-12 bg-canvas">
      <SectionWrapper>

        {/* SECTION HEADER */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="text-dim text-sm font-medium tracking-widest uppercase mb-2">
            {dict.eyebrow}
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-5xl tracking-tight">
            {dict.heading}
          </h2>
        </motion.div>

        {/* PROMOTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
              whileHover="hovered"
              onClick={() => window.open(promo.link, "_blank", "noopener,noreferrer")}
              className={`
                bg-surface border rounded-xl overflow-hidden flex flex-col cursor-pointer
                ${promo.highlight ? "border-white/30 md:col-span-2" : "border-edge"}
              `}
            >
              {/* IMAGE */}
              <div className={`relative overflow-hidden ${promo.highlight ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                <motion.div
                  className="absolute inset-0"
                  variants={{ hovered: { scale: 1.05 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Image
                    src={promo.imageUrl}
                    alt={`${promo.title[lang]} promotion at Overhandz Boxing Club`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute top-3 left-3">
                  <Badge>{promo.badge}</Badge>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-xl mb-2">{promo.title[lang]}</h3>
                <p className="text-dim text-sm leading-relaxed mb-4 flex-1">
                  {promo.description[lang]}
                </p>

                {promo.expiresLabel && (
                  <p className="text-dim text-xs mb-3">{promo.expiresLabel[lang]}</p>
                )}

                <div onClick={(e) => e.stopPropagation()} className="self-start">
                  <Button
                    href="https://overhandz.bigcartel.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnVVP3mw4tDYQARO-KihA8nWJUgqxVdb4hnfPNmihBKmSPPO5ra4_t1TdfpWg_aem_dcZpPULbT49BFVH5v3zdnA"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={promo.highlight ? "primary" : "secondary"}
                  >
                    {promo.cta[lang]}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </section>
  )
}
