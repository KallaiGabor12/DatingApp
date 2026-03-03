import { Testimonial } from "@prisma/client";
import TestimonialCarousel from "./TestimonialCarousel";

export default function TestimonialsDisplay({testimonials}:{testimonials:Omit<Testimonial, "id">[]}){
    return <section className="mt-7 mb-3 w-11/12 mx-auto" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="font-bold text-center mt-0 text-desktop-h2 lg:text-[50px] mb-2">Vélemények</h2>
        <TestimonialCarousel t={testimonials} />
    </section>
}