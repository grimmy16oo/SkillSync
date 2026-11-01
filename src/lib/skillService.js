import { supabase } from "./supabase.js";

export async function loadSkillData(userId) {
  if (!supabase || !userId) return { catalog: [], profileSkills: [], roles: [] };
  const [catalogResult, profileSkillsResult, rolesResult] = await Promise.all([
    supabase.from("skills").select("skill_id,skill_name,category").order("skill_name"),
    supabase.from("profile_skills").select("skill_id,skill_type,skills(skill_name,category)").eq("user_id", userId),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  const failed = [catalogResult, profileSkillsResult, rolesResult].find(result => result.error);
  if (failed) throw failed.error;
  return {
    catalog: catalogResult.data || [],
    profileSkills: (profileSkillsResult.data || []).map(row => ({
      skill_id: row.skill_id,
      skill_type: row.skill_type,
      skill_name: row.skills?.skill_name || "Skill",
      category: row.skills?.category || "",
    })),
    roles: (rolesResult.data || []).map(row => row.role),
  };
}

export async function addProfileSkill(userId, skillId, skillType) {
  if (!supabase) throw new Error("Skills are temporarily unavailable. Please try again later.");
  const { error } = await supabase.from("profile_skills").insert({
    user_id: userId,
    skill_id: skillId,
    skill_type: skillType,
  });
  if (error) throw error;
}

export async function createCatalogSkill(skillName) {
  if (!supabase) throw new Error("Skills are temporarily unavailable. Please try again later.");
  const name = skillName.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60) throw new Error("Skill names must be 2 to 60 characters.");

  const { data: catalog, error: catalogError } = await supabase
    .from("skills")
    .select("skill_id,skill_name,category");
  if (catalogError) throw catalogError;
  const existing = (catalog || []).find(skill => skill.skill_name.trim().toLocaleLowerCase() === name.toLocaleLowerCase());
  if (existing) return existing;

  const { data, error } = await supabase
    .from("skills")
    .insert({ skill_name: name, category: "Other" })
    .select("skill_id,skill_name,category")
    .single();
  if (!error) return data;

  // A concurrent request may have added the same skill after our catalogue read.
  if (error.code === "23505") {
    const { data: refreshed, error: refreshError } = await supabase
      .from("skills")
      .select("skill_id,skill_name,category");
    if (refreshError) throw refreshError;
    const duplicate = (refreshed || []).find(skill => skill.skill_name.trim().toLocaleLowerCase() === name.toLocaleLowerCase());
    if (duplicate) return duplicate;
  }
  throw error;
}

export async function removeProfileSkill(userId, skillId, skillType) {
  if (!supabase) throw new Error("Skills are temporarily unavailable. Please try again later.");
  const { error } = await supabase.from("profile_skills")
    .delete()
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .eq("skill_type", skillType);
  if (error) throw error;
}
