import PageContainer from '../../components/layout/PageContainer/PageContainer'

// Home sections (ตอนนี้เป็น placeholder ก็ได้)
import HeroSwiper from '../../components/home/HeroSwiper/HeroSwiper'
import FeatureCards from '../../components/home/FeatureCards/FeatureCards'
import HowItWorks from '../../components/home/HowItWorks/HowItWorks'
import VehicleShowcase from '../../components/home/VehicleShowcase/VehicleShowcase'
import CTASection from '../../components/home/CTASection/CTASection'

export default function HomePage() {
  return (
    <PageContainer>
      <HeroSwiper />
      <FeatureCards />
      <HowItWorks />
      <VehicleShowcase />
      <CTASection />
    </PageContainer>
  )
}
