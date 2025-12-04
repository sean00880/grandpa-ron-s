import { cn } from '@/lib/utils'
import Image from 'next/image'

export const LawncareLogo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative h-10 w-10 md:h-12 md:w-12', className)}>
            {/* Light mode logo */}
            <Image
                src="/img/logo_light.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain dark:hidden"
                priority
            />
            {/* Dark mode logo */}
            <Image
                src="/img/logo_dark.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain hidden dark:block"
                priority
            />
        </div>
    )
}

export const LawncareLogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-8', className)}>
            {/* Light mode logo */}
            <Image
                src="/img/logo_light.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain dark:hidden"
            />
            {/* Dark mode logo */}
            <Image
                src="/img/logo_dark.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain hidden dark:block"
            />
        </div>
    )
}
