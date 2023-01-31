import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { QwikLogo } from '../icons/qwik';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="/" title="qwik">
          <QwikLogo />
        </a>
      </div>
      <ul>
        <li>
          <a href="/register">
            Register
          </a>
        </li>
      </ul>
    </header>
  );
});
