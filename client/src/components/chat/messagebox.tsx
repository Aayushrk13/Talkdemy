import type {Message} from "../../../types/Message"
export default function MessageBox(Messageobj:Message){
    let messagecontent = Messageobj.messagecontent;
    return(
        <div className="w-1/5 bg-gray-300 rounded-xl p-1">
            <p>{messagecontent}</p>
        </div>
    );
}