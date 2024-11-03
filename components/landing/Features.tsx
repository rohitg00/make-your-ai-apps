import { 
  CodeBracketIcon,
  CubeTransparentIcon,
  RocketLaunchIcon,
  ServerIcon,
  CommandLineIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Drag & Drop Builder',
    description: 'Build your application visually with our intuitive drag and drop interface.',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Database Integration',
    description: 'Connect and manage your data with built-in database support.',
    icon: ServerIcon,
  },
  {
    name: 'API Generation',
    description: 'Automatically generate REST APIs for your application.',
    icon: CodeBracketIcon,
  },
  {
    name: 'One-Click Deploy',
    description: 'Deploy your application instantly with our cloud infrastructure.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Custom Code Integration',
    description: 'Add custom code and logic when needed.',
    icon: CommandLineIcon,
  },
  {
    name: 'Instant Updates',
    description: 'Push updates to your application in real-time.',
    icon: RocketLaunchIcon,
  },
]

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Build faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build your app
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create production-ready applications with our comprehensive set of tools and features.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 