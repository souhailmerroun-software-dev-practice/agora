import { AgoraVideoPlayer } from "agora-rtc-react";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useContext, useEffect, useState } from "react";
import { AgoraClientContext } from "./AgoraClientProvider";
import { AgoraConfigContext } from "./AgoraConfigProvider";
import ChannelControls from "./ChannelControls";
import Controls, { TracksControls } from "./TracksControls";
import Videos from "./Videos";

const token: string | null = null;

const VideoCall = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { appId } = useContext(AgoraConfigContext);
  const { client, useMicrophoneAndCameraTracks, users } =
    useContext(AgoraClientContext);

  const { setInCall } = props;
  const [start, setStart] = useState<boolean>(false);
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  console.log({tracks})

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      client.setClientRole("host");

      await client.join(appId, name, token, null);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      console.log("init ready");
      init("test");
    }
  }, [ready, tracks]);

  return (
    <div className="App">
      {start && <ChannelControls setStart={setStart} setInCall={setInCall} />}

      {start && tracks && <TracksControls tracks={tracks} />}

      {start && tracks && (
        <AgoraVideoPlayer
          style={{ height: "350px", width: "350px" }}
          videoTrack={tracks[1]}
        />
      )}

      {users.length === 0 && <p>No user have joined yet</p>}

      <table>
        <tr>
          <th>uid</th>
          <th>hasVideo</th>
          <th>hasAudio</th>
        </tr>
      </table>
      {users.map((user: IAgoraRTCRemoteUser) => (
        <tr>
          <td>{user.uid}</td>
          <td>{user.hasVideo ? "yes" : "no"}</td>
          <td>{user.hasAudio ? "yes": "no"}</td>
        </tr>
      ))}
    </div>
  );
};

export default VideoCall;
