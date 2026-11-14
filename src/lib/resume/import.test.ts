import { describe, expect, it } from "vitest";
import { emptyResume } from "./schema";
import { mergeLinkedInCsv, parseCsv, resumeFromText } from "./import";
import { draftToResume } from "./draft";

describe("resume source import", () => {
  it("preserves uncertain work and education as reviewable text instead of inventing dates", () => {
    const result = resumeFromText("Jane Example\njane@example.test\nExperience\nEngineer at Example\nEducation\nExample University\nSkills\nJavaScript, SQL", "en");
    expect(result.personal.name).toBe("Jane Example"); expect(result.personal.email).toBe("jane@example.test");
    expect(result.experience[0].description).toBe("Engineer at Example"); expect(result.experience[0].company).toBe(""); expect(result.experience[0].start).toBe("");
    expect(result.skills[0].items).toBe("JavaScript, SQL");
  });
  it("recognizes Turkish headings and does not mistake a document title for a name", () => {
    const result = resumeFromText("Özgeçmiş\nİş Deneyimi\nYazılım geliştirme\nBeceriler\nSQL", "tr");
    expect(result.personal.name).toBe(""); expect(result.experience[0].description).toBe("Yazılım geliştirme");
  });
  it("parses quoted commas, quotes and embedded line breaks in LinkedIn CSV", () => {
    const csv = 'Company Name,Title,Description,Started On,Finished On\r\n"Example, Inc",Engineer,"Built ""useful"" things\non a team",Jan 2020,Dec 2022';
    expect(parseCsv(csv)[0]["Company Name"]).toBe("Example, Inc");
    const result = mergeLinkedInCsv(emptyResume("en"), csv);
    expect(result.experience[0].description).toBe('Built "useful" things\non a team'); expect(result.experience[0].start).toBe("Jan 2020");
  });
  it("maps separate profile and skills files into one ordinary resume", () => {
    const profile = mergeLinkedInCsv(emptyResume(), 'First Name,Last Name,Headline\nJane,Example,Engineer');
    const result = mergeLinkedInCsv(profile, 'Name\nSQL\nJavaScript');
    expect(result.personal.name).toBe("Jane Example"); expect(result.skills[0].items).toBe("SQL, JavaScript");
  });
  it("rejects unsupported, broken and oversized source data", () => {
    expect(() => mergeLinkedInCsv(emptyResume(), 'Password,Secret\na,b')).toThrow("unsupported_csv");
    expect(() => parseCsv('Name\n"broken')).toThrow("invalid_file");
    expect(() => resumeFromText("a".repeat(50_001), "en")).toThrow("too_large");
  });
  it("rejects model output containing unrecognized fields", () => {
    expect(() => draftToResume({ instructions: "ignore the schema" }, "en")).toThrow();
  });
});
