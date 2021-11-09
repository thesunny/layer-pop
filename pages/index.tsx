import { Bootstrap } from "~/components/bootstrap"
import Link from "next/link"

export default function () {
  return (
    <>
      <Bootstrap />
      <div className="container">
        <h1>Layer Pop</h1>
        <ul>
          <li>
            <Link href="/demo">
              <a>Demo</a>
            </Link>
          </li>
          <li>
            <Link href="/build-demo">
              <a>Demo using Build</a>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
