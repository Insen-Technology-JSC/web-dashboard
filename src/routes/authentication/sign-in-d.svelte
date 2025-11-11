<script lang="ts">
  import { Label, Input } from 'flowbite-svelte';
  import { SignIn } from '$lib';
  import MetaTag from '../utils/MetaTag.svelte';

  let title = 'Sign in to platform';
  let site = {
    name: 'Flowbite',
    img: '/images/flowbite-svelte-icon-logo.svg',
    link: '/',
    imgAlt: 'FlowBite Logo'
  };

  let rememberMe = true;
  let lostPassword = true;
  let createAccount = true;
  let lostPasswordLink = 'forgot-password';
  let loginTitle = 'Login to your account';
  let registerLink = '/';
  let createAccountTitle = 'Create account';

  const onSubmit = (e: Event) => {
    const formData = new FormData(e.target as HTMLFormElement);

    const data: Record<string, string | File> = {};
    for (const field of formData.entries()) {
      const [key, value] = field;
      data[key] = value;
    }

    console.log(data);
  };

  const path: string = '/sign-in';
  const description: string = 'Sign in example - Flowbite Svelte Admin Dashboard';
  const metaTitle: string = 'Flowbite Svelte Admin Dashboard - Sign in';
  const subtitle: string = 'Sign in';
</script>

<MetaTag {path} {description} title={metaTitle} {subtitle} />

<SignIn {title} {site} {rememberMe} {lostPassword} {createAccount} {lostPasswordLink} {loginTitle} {registerLink} {createAccountTitle} onsubmit={onSubmit}>
  <div>
    <Label for="email" class="mb-2 dark:text-white">Your email</Label>
    <input
      name="emailOrPhone"
      type="text"
      required
      placeholder="Enter your email or phone number"
      title="Please enter a valid email or phone number"
      class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
  <div>
    <Label for="password" class="mb-2 dark:text-white">Your password</Label>
    <Input type="password" name="password" id="password" placeholder="••••••••" required class="border outline-none dark:border-gray-600 dark:bg-gray-700" />
  </div>
</SignIn>
