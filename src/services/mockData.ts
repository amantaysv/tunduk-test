import type { Candidate } from "@/types/candidate";

import candidatesLargeJson from "../../mock/candidates-large.json";
import candidatesJson from "../../mock/candidates.json";

export const candidatesData = candidatesJson as Candidate[];
export const candidatesLargeData = candidatesLargeJson as Candidate[];
