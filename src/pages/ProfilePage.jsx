import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  Code2,
  Pencil,
  RefreshCw,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

function ProfilePage({ user, profileData, profileLoadError, skillCatalog, profileSkills, skillRoles, skillLoadError, onChangeSkill, onCreateSkill, onAddRole, onRemoveRole, onSaveProfile, onBack, onOffer, onRequests }) {
  const [editOpen, setEditOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const metadata = user?.user_metadata ?? {};
  const [profileOverride, setProfileOverride] = useState(null);
  const profile = profileOverride || {
    name: profileData?.full_name || metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Student",
    institution: profileData?.institution || metadata.institution || "",
    bio: profileData?.bio || metadata.bio || "",
    dateOfBirth: profileData?.date_of_birth || "",
  };
  const [saving, setSaving] = useState(false);
  const submitProfile = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updatedProfile = {
      ...profile,
      name: String(form.get("name")),
      institution: String(form.get("institution")),
      bio: String(form.get("bio")),
      dateOfBirth: String(form.get("date_of_birth")),
    };
    setSaving(true);
    setSaveError("");
    try {
      await onSaveProfile(updatedProfile);
      setProfileOverride(updatedProfile);
      setEditOpen(false);
      setSaved(true);
    } catch (error) {
      setSaveError(error.message || "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };
  const learningSkills = profileSkills.filter(skill => skill.skill_type === "learning");
  const offeringSkills = profileSkills.filter(skill => skill.skill_type === "offering");
  return (
    <main className="profile-page">
      <button className="profile-back" onClick={onBack}>
        <ArrowLeft size={17} /> Back to app
      </button>
      {saved && (
        <div className="profile-saved" role="status">
          Profile changes saved.
          <button onClick={() => setSaved(false)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
      {saveError && <div className="profile-saved" role="alert">{saveError}</div>}
      {profileLoadError && <div className="profile-saved" role="alert">Profile data could not be loaded: {profileLoadError}</div>}
      <section className="profile-hero">
        <div className="profile-cover" />
        <div className="profile-identity">
          <div className="profile-photo">
            <UserRound size={58} />
          </div>
          <div className="profile-copy">
            <div className="profile-name-line">
              <h1>{profile.name}</h1>
              <span>
                <RefreshCw size={13} />{skillRoles.map(role => role === "instructor" ? "Instructor" : "Learner").join(" & ") || "Member"}
              </span>
              <button type="button" className="profile-requests-tag" onClick={onRequests}>Requests</button>
            </div>
            <p className="profile-school"><Building2 size={17} /> {profile.institution || "Institution not added"}</p><p className="profile-school">{user?.email}</p>
            <p className="profile-bio">{profile.bio || "Add a short introduction about yourself."}</p>
          </div>
          <div className="profile-actions">
            <button
              className="edit-profile-button"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={16} /> Edit profile
            </button>
            <button className="profile-offer-button" onClick={onOffer}>
              Offer a Skill
            </button>
          </div>
        </div>
      </section>
      <section className="profile-skills">
        <article className="profile-skill-panel learning-skills">
          <h2>
            LEARNER · SKILLS I'M LEARNING <span>{learningSkills.length}</span>
          </h2>
          <div className="profile-skill-list">
            {learningSkills.map((skill) => (
              <span key={skill.skill_id}><Code2 size={17} />{skill.skill_name}</span>
            ))}
            {!learningSkills.length && <small>No learner skills selected.</small>}
          </div>
        </article>
        <article className="profile-skill-panel offering-skills">
          <h2>
            INSTRUCTOR · SKILLS I OFFER <span>{offeringSkills.length}</span>
          </h2>
          <div className="profile-skill-list">
            {offeringSkills.map((skill) => (
              <span key={skill.skill_id}><Sparkles size={17} />{skill.skill_name}</span>
            ))}
            {!offeringSkills.length && <small>No instructor skills selected.</small>}
          </div>
        </article>
      </section>

      {editOpen && (
        <div
          className="profile-modal-backdrop"
          onClick={() => setEditOpen(false)}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setEditOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="edit-profile-title">Edit profile</h2>
            <form onSubmit={submitProfile}>
              <label>
                Name
                <input name="name" defaultValue={profile.name} required />
              </label>
              <label>Institution<input name="institution" defaultValue={profile.institution} /></label>
              <label>Date of birth<input name="date_of_birth" type="date" defaultValue={profile.dateOfBirth} /></label>
              {skillLoadError && <p className="posts-error" role="alert">{skillLoadError}</p>}
              <RoleSelection roles={skillRoles} onAddRole={onAddRole} onRemoveRole={onRemoveRole} />
              <SkillSelection title="Instructor · Skills I can offer" role="instructor" catalog={skillCatalog} selected={offeringSkills} enabled={skillRoles.includes("instructor")} onChange={onChangeSkill} onCreateSkill={onCreateSkill} />
              <SkillSelection title="Learner · Skills I want to learn" role="learner" catalog={skillCatalog} selected={learningSkills} enabled={skillRoles.includes("learner")} onChange={onChangeSkill} onCreateSkill={onCreateSkill} />
              <label>
                About me
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows="4"
                />
              </label>
              <button className="profile-save-button" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
                <Check size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function RoleSelection({ roles, onAddRole, onRemoveRole }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const availableRoles = ["learner", "instructor"].filter(item => !roles.includes(item));
  const updateRole = async (role, action) => {
    if (busy) return;
    setBusy(true);
    const roleName = role === "instructor" ? "Instructor" : "Learner";
    setMessage(`${action === "add" ? "Adding" : "Removing"} ${roleName} role…`);
    try {
      if (action === "add") await onAddRole(role);
      else await onRemoveRole(role);
      setMessage(`${roleName} role ${action === "add" ? "added" : "removed"}.`);
    } catch (error) {
      setMessage(error.message || `Unable to ${action} role.`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <fieldset className="profile-skill-editor profile-role-editor">
      <legend>Your roles</legend>
      <div className="profile-skill-editor-list">
        {roles.map(item => <span className="profile-edit-skill" key={item}>{item === "instructor" ? "Instructor" : "Learner"}<button type="button" aria-label={`Remove ${item} role`} onClick={event => { event.preventDefault(); event.stopPropagation(); updateRole(item, "remove"); }} disabled={busy}><X size={14} /></button></span>)}
        {!roles.length && <small>No roles assigned yet.</small>}
      </div>
      <small>Add or remove either role anytime. Instructor enables offering skills and course announcements.</small>
      {availableRoles.length > 0 ? <div className="profile-role-actions">
        {availableRoles.map(item => <button type="button" key={item} onClick={() => updateRole(item, "add")} disabled={busy}>{busy ? "Adding…" : `Add ${item === "instructor" ? "Instructor" : "Learner"}`}</button>)}
      </div> : <small>Both roles are active.</small>}
      {message && <small role="alert">{message}</small>}
    </fieldset>
  );
}

function SkillSelection({ title, role, catalog, selected, enabled, onChange, onCreateSkill }) {
  const [skillId, setSkillId] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedIds = new Set(selected.map(skill => skill.skill_id));
  const addSkill = async () => {
    if (!skillId || !enabled) return;
    setBusy(true); setMessage("");
    try { await onChange(skillId, role, "add"); setSkillId(""); }
    catch (error) { setMessage(error.message || "Unable to add skill."); }
    finally { setBusy(false); }
  };
  const removeSkill = async skill => {
    setMessage("");
    try { await onChange(skill.skill_id, role, "remove"); }
    catch (error) { setMessage(error.message || "Unable to remove skill."); }
  };
  const createAndAddSkill = async () => {
    if (!newSkillName.trim() || !enabled || busy) return;
    setBusy(true); setMessage("");
    try {
      const skill = await onCreateSkill(newSkillName);
      setNewSkillName("");
      try {
        await onChange(skill.skill_id, role, "add");
      } catch (error) {
        setMessage(`“${skill.skill_name}” was saved to the catalogue, but couldn't be added to your profile: ${error.message}`);
      }
    } catch (error) { setMessage(error.message || "Unable to save this skill to the catalogue."); }
    finally { setBusy(false); }
  };
  return (
    <fieldset className="profile-skill-editor">
      <legend>{title}</legend>
      <div className="profile-skill-editor-list">
        {selected.map(skill => (
          <span className="profile-edit-skill" key={skill.skill_id}>
            {skill.skill_name}
            <button type="button" aria-label={`Remove ${skill.skill_name}`} onClick={() => removeSkill(skill)}>
              <X size={14} />
            </button>
          </span>
        ))}
        {!selected.length && <small>No skills selected yet.</small>}
      </div>
      <div className="profile-add-skill-row">
        <select value={skillId} onChange={event => setSkillId(event.target.value)} aria-label={`Choose ${role} skill`} disabled={!enabled}>
          <option value="">{enabled ? "Choose from the skill catalogue" : `Instructor or learner role required`}</option>
          {catalog.filter(skill => !selectedIds.has(skill.skill_id)).map(skill => <option value={skill.skill_id} key={skill.skill_id}>{skill.skill_name}</option>)}
        </select>
        <button type="button" onClick={addSkill} disabled={!enabled || !skillId || busy}>{busy ? "Adding…" : "Add"}</button>
      </div>
      <div className="profile-add-skill-row profile-custom-skill-row">
        <input value={newSkillName} onChange={event => setNewSkillName(event.target.value)} maxLength={60} placeholder="Add a new skill" aria-label={`New ${role} skill`} disabled={!enabled || busy} />
        <button type="button" onClick={createAndAddSkill} disabled={!enabled || newSkillName.trim().length < 2 || busy}>{busy ? "Saving..." : "Create skill"}</button>
      </div>
      {message && <small role="alert">{message}</small>}
    </fieldset>
  );
}

export default ProfilePage;
