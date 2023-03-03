import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

import DataCard from "../../../components/city/data"
import DistributionCard from "../../../components/city/distribution"
import Visualization from "../../../components/city/visualization"
import axios from "../../../lib/axios"
import { cityData } from "../../../utils/constants/cities"

const City = ({ className }: any) => {
  const router = useRouter()
  const { city } = router.query

  const [current, setCurrent] = useState<keyof typeof cityData | null>(null)
  const [data, setData] = useState([])
  const [aqiResult, setAqiResult] = useState({
    value: 0,
    content: "",
  })
  const [aqiData, setAqiData] = useState([])

  const [month, setMonth] = useState(1)

  useEffect(() => {
    if (current) {
      axios
        .get(`getAQI?q=${current}`)
        .then((res) => {
          // setAqiData(res.data.data.distribution)
          setData(res.data.data.distribution.data)
        })
        .catch((err) => {
          console.warn(err)
        })
    }
  }, [current])

  useEffect(() => {
    if (data.length <= 0) return

    const temp = data.filter((d: any) => {
      return d.abbr === month
    })[0]

    if (!temp) return

    // @ts-ignore
    setAqiResult({ content: temp.context, value: temp.prediction })
  }, [month])

  useEffect(() => {
    if (city) setCurrent(city as string)
  }, [city])

  return (
    <div className="center min-h-screen bg-black/75">
      {current ? (
        <>
          <div className="my-12 flex w-2/3 flex-col rounded bg-white/10 py-6 px-4 shadow-md">
            <div className="flex w-full justify-center">
              <div className="mb-3 flex w-full flex-col gap-1 md:flex-row">
                <select
                  data-te-select-init
                  className="w-full grow rounded bg-white/50 px-4 py-2 outline-none"
                  onChange={(e) => setCurrent(e.target.value)}
                  value={current}
                >
                  {Object.keys(cityData).map((city, index) => {
                    const current = cityData[city]
                    if (!current) return <></>
                    return (
                      <option
                        key={current.id}
                        value={current.name}
                        className="capitalize text-black/50"
                      >
                        {current.name}
                      </option>
                    )
                  })}
                </select>
                <select
                  data-te-select-init
                  className="shrink rounded bg-white/50 px-4 py-2 outline-none"
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  value={month}
                >
                  {data?.map((itr: any, index) => {
                    return (
                      <option key={itr.abbr} value={itr.abbr} className="capitalize text-black/50">
                        {itr.month}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Visualization
                data={{
                  value: aqiResult.value?.toFixed(2),
                  content: aqiResult.content,
                }}
                head="Yearly AQI"
                footer=""
              />
              <Visualization
                data={{
                  value: "",
                  content: "",
                }}
                head="Yearly Heat wave"
                footer=""
              />
            </div>
            <div className="my-4">
              <DistributionCard data={aqiData} heading={"Monthly Average AQI Distribution"} />
            </div>
            <div className="mb-6 grid w-full">
              <DataCard
                city={current}
                heading={"Heading"}
                content={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi amet omnis necessitatibus
                      consectetur, ad molestiae quidem! Placeat, quis tempora voluptate sunt, dicta doloremque
                      tenetur cumque officiis amet alias repellat odit sequi velit repellendus dolore veniam.
                      Perferendis deleniti labore similique. Omnis vel cumque eveniet ullam voluptatem commodi
                      fuga consequatur ex voluptas tempora, sequi, saepe, ad in? Nihil accusantium odio
                      repudiandae cumque, assumenda aspernatur possimus. Quae ratione saepe ex. Labore incidunt
                      sint aspernatur quisquam ea aut ut fugiat modi iusto, praesentium adipisci, recusandae optio
                      veniam alias tempora molestias veritatis autem? Id laboriosam atque unde officia architecto
                    `}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="center text-white">Loading...</div>
      )}
    </div>
  )
}

export default City