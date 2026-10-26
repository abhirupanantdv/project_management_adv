from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

from adv_project import __version__ as version

setup(
    name="adv_project",
    version=version,
    description="Advanced Project Management and Tracking Cockpit for ERPNext",
    author="Anantdv",
    author_email="info@anantdv.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=[r for r in install_requires if r]
)
