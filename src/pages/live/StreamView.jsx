import { useSearchParams } from "react-router-dom";

function StreamView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); // "123"
  const type = searchParams.get('type'); // "vod"

  return (
    <div>
      <div>StreamView</div>
      <h1>방송 시청 페이지</h1>
      <p>방송 ID: {id}</p>
      <p>방송 타입: {type}</p>
      <hr/>
    </div>
  )
}

export default StreamView