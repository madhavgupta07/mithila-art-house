import Container from '../components/Common/Container';
import Seo from '../components/Common/Seo';
import Button from '../components/Common/Button';
import ArtImage from '../components/Common/ArtImage';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="This gallery page could not be found. Return to the collection or explore the rest of the site."
        canonical="/404"
      />
      <Container className="flex min-h-[70vh] items-center py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-luxe text-vermilion">404 · Wrong turn</p>
            <h1 className="mt-5 font-display text-6xl leading-none text-ink sm:text-7xl">This page wandered off.</h1>
            <p className="mt-6 max-w-md text-[14px] leading-7 text-charcoal/70">
              The artwork you were looking for may have moved, or the address may be incomplete. The collection is a good place to begin again.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/shop">Explore the collection</Button>
              <Button to="/" variant="outline">Return home</Button>
            </div>
          </div>
          <ArtImage
            src="/images/art/art-modern-abstract.svg"
            alt="Abstract lotus illustration"
            className="mx-auto aspect-[4/5] w-full max-w-md border-mithila bg-paper p-2"
          />
        </div>
      </Container>
    </>
  );
}
